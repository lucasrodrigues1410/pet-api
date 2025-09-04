import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { UserAlreadyExistError } from "@/modules/auth/domain/errors/user-already-exists.error";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import { StaffRoles } from "@/modules/staff/infra/decorators/staff-roles.decorator";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { InviteEmployeeUseCase } from "../../../application/use-cases/invite-employee.use-case";
import { ValidateInviteUseCase } from "../../../application/use-cases/validate-invite.use-case";
import {
	InviteEmployeeRequestDto,
	InviteEmployeeResponseDto,
} from "../dtos/invite-employee.dto";
import { ValidateInviteResponseDto } from "../dtos/validate-invite.dto";

@ApiTags("Convites")
@Controller("invites")
export class InviteController {
	constructor(
		private readonly inviteEmployeeUseCase: InviteEmployeeUseCase,
		private readonly validateInviteUseCase: ValidateInviteUseCase,
	) {}

	@Post("employee")
	@ApiOperation({
		summary: "Convidar funcionário para empresa",
		description:
			"Cria um usuário parcial e envia convite para funcionário se juntar à empresa",
		operationId: "inviteEmployee",
	})
	@ZodResponse({
		status: 201,
		type: InviteEmployeeResponseDto,
	})
	@UserTypeDecorator("company")
	@UseGuards(CompanyGuard)
	@StaffRoles("admin", "manager")
	async inviteEmployee(
		@User("sub") userId: string,
		@User("companyId") companyId: string,
		@Body() body: InviteEmployeeRequestDto,
	): Promise<InviteEmployeeResponseDto> {
		const { name, email, role } = body;

		const result = await this.inviteEmployeeUseCase.execute({
			name,
			email,
			companyId,
			inviterUserId: userId,
			role,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case UserAlreadyExistError:
					throw new ConflictException(error.message);
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { invite, user } = result.value;

		return {
			inviteId: invite.id.toString(),
			token: invite.token,
			message: `Convite enviado para ${user.name} (${user.email}). O convite expira em 7 dias.`,
		};
	}

	@Get("validate/:token")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: "Validar token de convite",
		description: "Verifica se um token de convite é válido, não expirou e não foi usado",
		operationId: "validateInvite",
	})
	@ZodResponse({
		status: 200,
		type: ValidateInviteResponseDto,
	})
	@Public()
	async validateInvite(@Param("token") token: string): Promise<ValidateInviteResponseDto> {
		const result = await this.validateInviteUseCase.execute({ token });

		if (result.isLeft()) {
			const error = result.value;
			
			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { invite, isValid, isExpired, isUsed } = result.value;

		let message = "";
		if (isValid) {
			message = "Convite válido";
		} else if (isExpired) {
			message = "Convite expirado";
		} else if (isUsed) {
			message = "Convite já foi usado";
		}

		return {
			isValid,
			isExpired,
			isUsed,
			invite: isValid ? {
				id: invite.id.toString(),
				token: invite.token,
				expiresAt: invite.expiresAt.toISOString(),
				usedAt: invite.usedAt?.toISOString(),
				userId: invite.userId.toString(),
				user: invite.user.toObject(),
			} : undefined,
			message,
		};
	}
}
