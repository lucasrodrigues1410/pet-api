import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRoles } from "@/modules/staff/infra/decorators/staff-roles.decorator";
import { UserType } from "@/modules/user/domain/entities/user.entity";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { DeactivateServiceUseCase } from "../../../application/use-cases/deactivate-service.use-case";
import { GetServiceByIdUseCase } from "../../../application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "../../../application/use-cases/list-services-by-company.use-case";
import { SearchServicesUseCase } from "../../../application/use-cases/search-services.use-case";
import { SearchServicesRequestDto } from "../dtos/search-services.dto";
import { ServiceResponseList } from "../dtos/service.dto";
import { ServiceDetailsResponse } from "../dtos/service-details.dto";

@ApiTags("Serviços")
@Controller("services")
export class ServiceController {
	constructor(
		private readonly getServiceByIdUseCase: GetServiceByIdUseCase,
		private readonly listServicesByCompanyUseCase: ListServicesByCompanyUseCase,
		private readonly deactivateServiceUseCase: DeactivateServiceUseCase,
		private readonly searchServicesUseCase: SearchServicesUseCase,
	) {}

	@Get("/:id")
	@ApiOperation({ summary: "Buscar serviço por ID" })
	@ZodResponse({ status: 200, type: ServiceDetailsResponse })
	async getServiceById(@Param("id") id: string) {
		const result = await this.getServiceByIdUseCase.execute({ id });

		if (result.isLeft()) {
			throw new NotFoundException(result.value.message);
		}

		const service = result.value.service.toObject();

		return {
			...service,
			categories: result.value.service.categories.map((c) => c.toObject()),
			company: result.value.service.company.toObject(),
		};
	}

	@Get("/company/:companyId")
	@ApiOperation({ summary: "Listar serviços por empresa" })
	@ZodResponse({ status: 200, type: ServiceResponseList })
	async listServicesByCompany(@Param("companyId") companyId: string) {
		const result = await this.listServicesByCompanyUseCase.execute({
			companyId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return {
			items: result.value.services.map((i) => i.toObject()),
		};
	}

	@Post("/search")
	@Public()
	@ApiOperation({ summary: "Buscar serviços com filtros avançados" })
	@ZodResponse({ status: 200, type: ServiceResponseList })
	async searchServices(
		@Body() data: SearchServicesRequestDto,
		@Query() query: PaginationQueryDto,
	) {
		const result = await this.searchServicesUseCase.execute({
			...data,
			...query,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return {
			items: result.value.items.map((i) => i.toObject()),
			meta: result.value.meta,
		};
	}

	@Patch("/:id/company/:companyId/deactivate")
	@HttpCode(204)
	@ApiOperation({ summary: "Inativar serviço da empresa" })
	@UserTypeDecorator(UserType.COMPANY)
	@StaffRoles(StaffRole.ADMIN, StaffRole.MANAGER)
	@UseGuards(CompanyGuard)
	async deactivateService(
		@Param("id") id: string,
		@Param("companyId") companyId: string,
	) {
		const result = await this.deactivateServiceUseCase.execute({
			id,
			companyId,
		});

		if (result.isLeft()) {
			throw new NotFoundException(result.value.message);
		}
	}
}
