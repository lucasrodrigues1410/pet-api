import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { UserType } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import { DeleteCompanyAvailabilityUseCase } from "@/modules/company-availability/application/use-cases/delete-company-availability.use-case";
import { GetCompanyAvailabilityUseCase } from "@/modules/company-availability/application/use-cases/get-company-availability.use-case";
import { UpsertCompanyAvailabilityUseCase } from "@/modules/company-availability/application/use-cases/upsert-company-availability.use-case";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRoles } from "@/modules/staff/infra/decorators/staff-roles.decorator";
import {
	CompanyAvailabilityParamsDto,
	UpsertCompanyAvailabilityBodyDto,
} from "../dtos/company-availability.dto";
import { CompanyAvailabilityListResponseDto, CompanyAvailabilityResponseDto } from "../dtos/company-availability.response.dto";

@ApiTags("Disponibilidade da Empresa")
@Controller("company/:companyId/availability")
export class CompanyAvailabilityController {
	constructor(
		private readonly upsertUseCase: UpsertCompanyAvailabilityUseCase,
		private readonly deleteUseCase: DeleteCompanyAvailabilityUseCase,
		private readonly getUseCase: GetCompanyAvailabilityUseCase,
	) { }

	@Get()
	@ApiOperation({ summary: "Listar disponibilidade da empresa" })
	@ApiResponse({ status: 200, type: CompanyAvailabilityListResponseDto })
	@Public()
	async list(@Param("companyId") companyId: string) {
		const result = await this.getUseCase.execute({ companyId });
		const items = result.isRight() ? result.value.items : [];
		return {
			items: items.map((a) => ({
				companyId: a.companyId.toString(),
				day: a.day,
				timeRange: {
					startTime: a.timeRange.startTime,
					endTime: a.timeRange.endTime,
				},
				launchTime: {
					startTime: a.launchTime.startTime,
					endTime: a.launchTime.endTime,
				},
			})),
		}
	}

	@Put(":day")
	@HttpCode(200)
	@ApiOperation({ summary: "Criar/Atualizar disponibilidade por dia" })
	@ApiResponse({ status: 200, type: CompanyAvailabilityResponseDto })
	@UserType("COMPANY")
	@UseGuards(CompanyGuard)
	@StaffRoles(StaffRole.ADMIN, StaffRole.MANAGER)
	async upsert(
		@Param() params: CompanyAvailabilityParamsDto,
		@Body() body: UpsertCompanyAvailabilityBodyDto,
	) {
		const result = await this.upsertUseCase.execute({
			companyId: params.companyId,
			day: params.day,
			...body,
		});

		if (result.isLeft()) {
			throw new Error(result.value.message);
		}

		const response: CompanyAvailabilityResponseDto = {
			companyId: result.value.availability.companyId.toString(),
			day: result.value.availability.day as any,
			timeRange: {
				startTime: result.value.availability.timeRange.startTime,
				endTime: result.value.availability.timeRange.endTime,
			},
			launchTime: {
				startTime: result.value.availability.launchTime.startTime,
				endTime: result.value.availability.launchTime.endTime,
			},
		} as any;
		return response;
	}

	@Delete(":day")
	@ApiOperation({ summary: "Remover disponibilidade por dia" })
	@HttpCode(204)
	@UserType("COMPANY")
	@UseGuards(CompanyGuard)
	@StaffRoles(StaffRole.ADMIN, StaffRole.MANAGER)
	async remove(
		@Param() params: CompanyAvailabilityParamsDto,
	) {
		const result = await this.deleteUseCase.execute({ companyId: params.companyId, day: params.day });
		if (result.isLeft()) {
			throw new Error(result.value.message);
		}
	}
}
