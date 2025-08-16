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
import { SignInUseCase } from "../../../application/use-cases/sign-in.use-case";
import { SignUpUseCase } from "../../../application/use-cases/sign-up.use-case";
import { InvalidCredentialsError } from "../../../domain/errors/invalid-credentials.error";
import { UserAlreadyExistError } from "../../../domain/errors/user-already-exists.error";
import { Public } from "../decorators/public.decorator";
import { SignInRequestDto, SignInResponseDto } from "../dtos/sign-in.dto";
import { SignInCompanyResponseDto } from "../dtos/sign-in-company.dto";
import { SignUpRequestDto } from "../dtos/sign-up.dto";
import { SignInCompanyPresenter } from "../presenters/sign-in-company.presenter";
import { SignInCustomerPresenter } from "../presenters/sign-in-customer.presenter";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
	constructor(
		private signInUseCase: SignInUseCase,
		private signUpUseCase: SignUpUseCase,
		private signInCompanyUseCase: SignInCompanyUseCase,
	) { }

	@Post("sign-in")
	@ApiOperation({ summary: "Login de usuário" })
	@ApiResponse({
		status: 200,
		type: SignInResponseDto,
	})
	@Public()
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() body: SignInRequestDto) {
		const { email, password } = body;

		const result = await this.signInUseCase.execute({
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

	@Post("sign-up")
	@ApiOperation({ summary: "Registro de usuário" })
	@ApiResponse({ status: 201 })
	@Public()
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() body: SignUpRequestDto) {
		const { name, email, password } = body;

		const result = await this.signUpUseCase.execute({
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
	async signInCompany(@Body() body: SignInRequestDto) {
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
