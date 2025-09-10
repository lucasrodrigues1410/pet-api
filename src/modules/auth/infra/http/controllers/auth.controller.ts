import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AcceptInviteUseCase } from "../../../application/use-cases/accept-invite.use-case";
import { GetSessionUseCase } from "../../../application/use-cases/get-session.use-case";
import { SignInUseCase } from "../../../application/use-cases/sign-in.use-case";
import { SignUpUseCase } from "../../../application/use-cases/sign-up.use-case";
import { InvalidCredentialsError } from "../../../domain/errors/invalid-credentials.error";
import { UserAlreadyExistError } from "../../../domain/errors/user-already-exists.error";
import type { UserPayload } from "../../strategies/jwt.strategy";
import { Public } from "../decorators/public.decorator";
import { User } from "../decorators/user.decorator";
import {
	AcceptInviteRequestDto,
	AcceptInviteResponseDto,
} from "../dtos/accept-invite.dto";
import { SessionResponseDto } from "../dtos/session.dto";
import { SignInRequestDto, SignInResponseDto } from "../dtos/sign-in.dto";
import { SignUpRequestDto } from "../dtos/sign-up.dto";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
	constructor(
		private signInUseCase: SignInUseCase,
		private signUpUseCase: SignUpUseCase,
		private getSessionUseCase: GetSessionUseCase,
		private acceptInviteUseCase: AcceptInviteUseCase,
	) {}

	@Post("sign-in")
	@ApiOperation({ summary: "Login de usuário", operationId: "signIn" })
	@ZodResponse({ status: 200, type: SignInResponseDto })
	@Public()
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() body: SignInRequestDto) {
		const { email, password, type } = body;

		const result = await this.signInUseCase.execute({ email, password, type });

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
			type: result.value.type,
			accessToken: result.value.accessToken,
			avatar: result.value.avatar?.url,
			staffRole: result.value.staffRole,
			companyId: result.value.companyId,
		};
	}

	@Post("sign-up")
	@ApiOperation({ summary: "Registro de usuário", operationId: "signUp" })
	@ApiResponse({ status: 201 })
	@Public()
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() body: SignUpRequestDto) {
		const { name, email, password } = body;

		const result = await this.signUpUseCase.execute({ name, email, password });

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

	@Get("session")
	@ApiOperation({
		summary: "Obter informações da sessão do usuário",
		operationId: "getSession",
	})
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

	@Post("accept-invite")
	@ApiOperation({
		summary: "Aceitar convite de funcionário",
		description:
			"Finaliza o cadastro do funcionário convidado definindo uma nova senha",
		operationId: "acceptInvite",
	})
	@ZodResponse({ status: 201, type: AcceptInviteResponseDto })
	@Public()
	@HttpCode(HttpStatus.CREATED)
	async acceptInvite(
		@Body() body: AcceptInviteRequestDto,
	): Promise<AcceptInviteResponseDto> {
		const { token, password } = body;

		const result = await this.acceptInviteUseCase.execute({ token, password });

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			id: result.value.user.id.toString(),
			name: result.value.user.name,
			email: result.value.user.email,
			accessToken: result.value.accessToken,
			staffRole: result.value.staffRole,
			companyId: result.value.companyId,
			avatar: result.value.user.avatar?.url,
			type: result.value.user.type,
		};
	}
}
