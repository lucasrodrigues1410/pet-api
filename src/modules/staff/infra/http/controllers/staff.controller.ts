import { verifyWebhook } from "@clerk/fastify/webhooks";
import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Post,
	Query,
	Req,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { FastifyRequest } from "fastify";
import { ZodResponse } from "nestjs-zod";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { CreateStaffUseCase } from "@/modules/staff/application/use-cases/create-staff.use-case";
import { GetStaffByUserIdUseCase } from "@/modules/staff/application/use-cases/get-staff-by-user-id.use-case";
import { ListStaffByCompanyUseCase } from "@/modules/staff/application/use-cases/list-staff-by-company.use-case";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { GetStaffByUserIdDto } from "../dtos/get-staff-by-user-id.dto";
import {
	ListStaffByCompanyQueryDto,
	ListStaffByCompanyResponseDto,
} from "../dtos/list-staff-by-company.dto";
import { StaffPresenter } from "../presenters/staff.presenter";
import { StaffListPresenter } from "../presenters/staff-list.presenter";

@ApiTags("Colaboradores")
@Controller("staffs")
export class StaffController {
	constructor(
		private readonly listStaffByCompanyUseCase: ListStaffByCompanyUseCase,
		private readonly getStaffByUserIdUseCase: GetStaffByUserIdUseCase,
		private readonly createStaffUseCase: CreateStaffUseCase,
	) {}

	@Post("webhook")
	async handleWebhook(@Req() req: FastifyRequest) {
		try {
			const event = await verifyWebhook(req);
			if (event.type === "organizationMembership.created") {
				const companyId = event.data.public_metadata.appCompanyId as string;
				await this.createStaffUseCase.execute({
					email: event.data.public_user_data.identifier,
					name: `${event.data.public_user_data.first_name} ${event.data.public_user_data.last_name}`,
					companyId,
					role: event.data.role as StaffRole,
				});
			}
		} catch (_) {
			throw new BadRequestException("Invalid webhook payload");
		}
		return { received: true };
	}

	@Get("/company")
	@ApiOperation({
		summary: "Listar colaboradores por empresa",
		operationId: "listStaffByCompany",
	})
	@ZodResponse({ status: 200, type: ListStaffByCompanyResponseDto })
	async listByCompany(
		@User("sub") userId: string,
		@Query() query: ListStaffByCompanyQueryDto,
	) {
		const result = await this.listStaffByCompanyUseCase.execute({
			userId,
			query,
		});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return StaffListPresenter.present(result.value);
	}

	@Get("/me")
	@ApiOperation({
		summary: "Obter dados do colaborador logado",
		operationId: "getStaffByCurrentUserId",
	})
	@ZodResponse({ status: 200, type: GetStaffByUserIdDto })
	async getByCurrentUserId(@User("sub") userId: string) {
		const result = await this.getStaffByUserIdUseCase.execute(userId);
		if (result.isLeft()) {
			throw new NotFoundException();
		}
		return StaffPresenter.present(result.value);
	}
}
