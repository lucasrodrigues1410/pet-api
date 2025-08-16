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
import { SignInCompanyUseCase } from "@/modules/auth/application/use-cases/sign-in-company.use-case";
import { LoginUseCase } from "../../../application/use-cases/login.use-case";
import { RegisterUseCase } from "../../../application/use-cases/register.use-case";
import { InvalidCredentialsError } from "../../../domain/errors/invalid-credentials.error";
import { UserAlreadyExistError } from "../../../domain/errors/user-already-exists.error";
import { Public } from "../decorators/public.decorator";
import { LoginRequestDto, LoginResponseDto } from "../dtos/login.dto";
import { RegisterRequestDto } from "../dtos/register.dto";
import { SignInCompanyResponseDto } from "../dtos/sign-in-company.dto";
import { SignInCompanyPresenter } from "../presenters/sign-in-company.presenter";
import { SignInCustomerPresenter } from "../presenters/sign-in-customer.presenter";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
	constructor(
		private loginUseCase: LoginUseCase,
		private registerUseCase: RegisterUseCase,
		private signInCompanyUseCase: SignInCompanyUseCase,
	) {}

	@Post("login")
	@ApiOperation({ summary: "Login de usuário" })
	@ApiResponse({
		status: 200,
		type: LoginResponseDto,
	})
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

		return SignInCustomerPresenter.toHttp(result.value);
	}

	@Post("register")
	@ApiOperation({ summary: "Registro de usuário" })
	@ApiResponse({ status: 201 })
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

	@Post("sign-in/company")
	@ApiOperation({ summary: "Login empresarial" })
	@ApiResponse({ status: 200, type: SignInCompanyResponseDto })
	@Public()
	@HttpCode(HttpStatus.OK)
	async signInCompany(@Body() body: LoginRequestDto) {
		const { email, password } = body;

		const result = await this.signInCompanyUseCase.execute({
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

		return SignInCompanyPresenter.toHttp(result.value);
	}
}
