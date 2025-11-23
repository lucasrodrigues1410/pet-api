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
import { ListStaffByCompanyUseCase } from "@/modules/staff/application/use-cases/list-staff-by-company.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import {
	ListStaffByCompanyQueryDto,
	ListStaffByCompanyResponseDto,
} from "../dtos/list-staff-by-company.dto";
import { StaffListPresenter } from "../presenters/staff-list.presenter";

@ApiTags("Colaboradores")
@Controller("staffs")
export class StaffController {
	constructor(
		private readonly listStaffByCompanyUseCase: ListStaffByCompanyUseCase,
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
			if (result.value instanceof ResourceNotFoundError) {
				throw new NotFoundException(result.value.message);
			}
			throw new BadRequestException();
		}
		return StaffListPresenter.present(result.value);
	}
}
