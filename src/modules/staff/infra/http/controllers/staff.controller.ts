import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import { DeleteStaffUseCase } from "@/modules/staff/application/use-cases/delete-staff.use-case";
import { ListStaffByCompanyUseCase } from "@/modules/staff/application/use-cases/list-staff-by-company.use-case";
import { StaffRoles } from "@/modules/staff/infra/decorators/staff-roles.decorator";
import {
	ListStaffByCompanyQueryDto,
	ListStaffByCompanyResponseDto,
} from "../dtos/list-staff-by-company.dto";

@ApiTags("Colaboradores")
@Controller("staffs")
export class StaffController {
	constructor(
		private readonly listStaffByCompanyUseCase: ListStaffByCompanyUseCase,
		private readonly deleteStaffUseCase: DeleteStaffUseCase,
	) {}

	@Get("/company/:companyId")
	@ApiOperation({
		summary: "Listar colaboradores por empresa",
		operationId: "listStaffByCompany",
	})
	@ZodResponse({ status: 200, type: ListStaffByCompanyResponseDto })
	@UserTypeDecorator("company")
	@UseGuards(CompanyGuard)
	async listByCompany(
		@Param("companyId") companyId: string,
		@Query() query: ListStaffByCompanyQueryDto,
	) {
		const result = await this.listStaffByCompanyUseCase.execute({
			companyId,
			query,
		});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return {
			items: result.value.items.map((s) => {
				return { ...s.toObject(), user: s.user.toObject() };
			}),
			meta: result.value.meta,
		};
	}

	@Delete(":id/company/:companyId")
	@HttpCode(204)
	@ApiOperation({
		summary: "Soft delete colaborador",
		operationId: "deleteStaff",
	})
	@UserTypeDecorator("company")
	@StaffRoles("admin", "manager")
	@UseGuards(CompanyGuard)
	async delete(@Param("id") id: string, @Param("companyId") companyId: string) {
		const result = await this.deleteStaffUseCase.execute({ id, companyId });
		if (result.isLeft()) {
			throw new NotFoundException();
		}
	}
}
