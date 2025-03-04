import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { RegisterDto } from "../dtos/register.dto";
import { Public } from "../decorators/public.decorator";
import { InvalidCredentialsError } from "../../application/errors/invalid-credentials.error";
import { UserAlreadyExistError } from "../../application/errors/user-already-exists.error";
import { LoginResponseDto } from "../dtos/login-response.dto";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
	constructor(
		private loginUseCase: LoginUseCase,
		private registerUseCase: RegisterUseCase,
	) {}

	@ApiOperation({ summary: "Login de usuário" })
	@ApiResponse({
		status: 200,
		description: "Usuário autenticado com sucesso",
		type: LoginResponseDto,
	})
	@Post("login")
	@Public()
	@HttpCode(HttpStatus.OK)
	async login(@Body() body: LoginDto) {
		const { email, password } = body;

		const result = await this.loginUseCase.execute({
			email,
			password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case InvalidCredentialsError:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { accessToken } = result.value;

		return {
			access_token: accessToken,
		};
	}

	@ApiOperation({ summary: "Registro de usuário" })
	@ApiResponse({ status: 201, description: "Usuário registrado com sucesso" })
	@Post("register")
	@Public()
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() body: RegisterDto) {
		const { name, email, password } = body;

		const result = await this.registerUseCase.execute({
			name,
			email,
			password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case UserAlreadyExistError:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}
	}
}
