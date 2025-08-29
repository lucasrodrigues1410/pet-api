import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { SignInCompanyUseCase } from "@/modules/auth/application/use-cases/sign-in-company.use-case";
import { GetSessionUseCase } from "../../../application/use-cases/get-session.use-case";
import { SignInUseCase } from "../../../application/use-cases/sign-in.use-case";
import { SignUpUseCase } from "../../../application/use-cases/sign-up.use-case";
import { InvalidCredentialsError } from "../../../domain/errors/invalid-credentials.error";
import { UserAlreadyExistError } from "../../../domain/errors/user-already-exists.error";
import type { UserPayload } from "../../strategies/jwt.strategy";
import { Public } from "../decorators/public.decorator";
import { User } from "../decorators/user.decorator";
import { SessionResponseDto } from "../dtos/session.dto";
import { SignInRequestDto, SignInResponseDto } from "../dtos/sign-in.dto";
import { SignInCompanyResponseDto } from "../dtos/sign-in-company.dto";
import { SignUpRequestDto } from "../dtos/sign-up.dto";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
	constructor(
		private signInUseCase: SignInUseCase,
		private signUpUseCase: SignUpUseCase,
		private signInCompanyUseCase: SignInCompanyUseCase,
		private getSessionUseCase: GetSessionUseCase,
	) {}

	@Post("sign-in")
	@ApiOperation({ summary: "Login de usuário" })
	@ZodResponse({ type: SignInResponseDto })
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

		return {
			id: result.value.id.toString(),
			name: result.value.name,
			email: result.value.email,
			accessToken: result.value.accessToken,
			avatar: result.value.avatar?.url,
		};
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
	@ZodResponse({ status: 200, type: SignInCompanyResponseDto })
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

		return {
			id: result.value.id.toString(),
			name: result.value.name,
			email: result.value.email,
			accessToken: result.value.accessToken,
			staffRole: result.value.staffRole,
			companyId: result.value.companyId,
			avatar: result.value.avatar?.url,
		};
	}

	@Get("session")
	@ApiOperation({ summary: "Obter informações da sessão do usuário" })
	@ZodResponse({ status: 200, type: SessionResponseDto })
	@HttpCode(HttpStatus.OK)
	async getSession(@User() payload: UserPayload) {
		const result = await this.getSessionUseCase.execute(payload);

		return {
			id: result.value.sub.toString(),
			name: result.value.name,
			email: result.value.email,
			type: result.value.type,
			companyId: result.value.companyId,
		};
	}
}
