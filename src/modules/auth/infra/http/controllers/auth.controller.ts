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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUseCase } from "../../../application/use-cases/login.use-case";
import { RegisterUseCase } from "../../../application/use-cases/register.use-case";
import { InvalidCredentialsError } from "../../../domain/errors/invalid-credentials.error";
import { UserAlreadyExistError } from "../../../domain/errors/user-already-exists.error";
import { Public } from "../decorators/public.decorator";
import { LoginRequestDto, LoginResponseDto } from "../dtos/login.dto";
import { RegisterRequestDto } from "../dtos/register.dto";

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
	async login(@Body() body: LoginRequestDto) {
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
	async register(@Body() body: RegisterRequestDto) {
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
