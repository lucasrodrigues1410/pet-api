import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { GetStaffByUserIdUseCase } from "@/modules/staff/application/use-cases/get-staff-by-user-id.use-case";
import { ListStaffByCompanyUseCase } from "@/modules/staff/application/use-cases/list-staff-by-company.use-case";
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
	) {}

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
