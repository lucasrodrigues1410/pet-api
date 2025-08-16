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
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationPresenter } from "@/core/infra/presenters/pagination.presenter";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { UserType } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRoles } from "@/modules/staff/infra/decorators/staff-roles.decorator";
import { PaginationQueryDto } from "@/shared/utils/pagination-query";
import { CreateServiceUseCase } from "../../../application/use-cases/create-service.use-case";
import { DeactivateServiceUseCase } from "../../../application/use-cases/deactivate-service.use-case";
import { GetServiceByIdUseCase } from "../../../application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "../../../application/use-cases/list-services-by-company.use-case";
import { SearchServicesUseCase } from "../../../application/use-cases/search-services.use-case";
import { UpdateServiceUseCase } from "../../../application/use-cases/update-service.use-case";
import { CreateServiceRequestDto } from "../dtos/create-service.dto";
import { SearchServicesRequestDto } from "../dtos/search-services.dto";
import {
	ServiceResponse,
	ServiceResponseList,
} from "../dtos/service.response.dto";
import { ServiceDetailsResponse } from "../dtos/service-details.response.dto";
import { UpdateServiceRequestDto } from "../dtos/update-service.dto";
import { ServicePresenter } from "../presenters/service.presenter";
import { ServiceDetailsPresenter } from "../presenters/service-details.presenter";

@ApiTags("Serviços")
@Controller("services")
export class ServiceController {
	constructor(
		private readonly getServiceByIdUseCase: GetServiceByIdUseCase,
		private readonly listServicesByCompanyUseCase: ListServicesByCompanyUseCase,
		private readonly createServiceUseCase: CreateServiceUseCase,
		private readonly updateServiceUseCase: UpdateServiceUseCase,
		private readonly deactivateServiceUseCase: DeactivateServiceUseCase,
		private readonly searchServicesUseCase: SearchServicesUseCase,
	) {}

	@Get("/:id")
	@ApiOperation({ summary: "Buscar serviço por ID" })
	@ApiResponse({
		status: 200,
		type: ServiceDetailsResponse,
	})
	async getServiceById(@Param("id") id: string) {
		const result = await this.getServiceByIdUseCase.execute({ id });

		if (result.isLeft()) {
			throw new NotFoundException(result.value.message);
		}

		return ServiceDetailsPresenter.toHTTP(result.value.service);
	}

	@Get("/company/:companyId")
	@ApiOperation({ summary: "Listar serviços por empresa" })
	@ApiResponse({
		status: 200,
		type: [ServiceResponse],
	})
	async listServicesByCompany(@Param("companyId") companyId: string) {
		const result = await this.listServicesByCompanyUseCase.execute({
			companyId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return result.value.services.map(ServicePresenter.toHTTP);
	}

	@Post("/search")
	@Public()
	@ApiOperation({ summary: "Buscar serviços com filtros avançados" })
	@ApiResponse({
		status: 200,
		type: ServiceResponseList,
	})
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

		return PaginationPresenter.toHTTP({
			items: result.value.items.map(ServiceDetailsPresenter.toHTTP),
			meta: result.value.meta,
		});
	}

	@Post("/company/:companyId")
	@HttpCode(201)
	@ApiOperation({ summary: "Criar serviço para empresa" })
	@ApiResponse({
		status: 201,
		type: ServiceResponse,
	})
	@UserType("COMPANY")
	@StaffRoles(StaffRole.ADMIN, StaffRole.MANAGER)
	@UseGuards(CompanyGuard)
	async createService(
		@Param("companyId") companyId: string,
		@Body() data: CreateServiceRequestDto,
	) {
		const result = await this.createServiceUseCase.execute({
			...data,
			companyId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return ServicePresenter.toHTTP(result.value.service);
	}

	@Put("/:id/company/:companyId")
	@HttpCode(204)
	@ApiOperation({ summary: "Atualizar serviço da empresa" })
	@UserType("COMPANY")
	@StaffRoles(StaffRole.ADMIN, StaffRole.MANAGER)
	@UseGuards(CompanyGuard)
	async updateService(
		@Param("id") id: string,
		@Param("companyId") companyId: string,
		@Body() data: UpdateServiceRequestDto,
	) {
		const result = await this.updateServiceUseCase.execute({
			id,
			companyId,
			...data,
		});

		if (result.isLeft()) {
			throw new NotFoundException(result.value.message);
		}
	}

	@Patch("/:id/company/:companyId/deactivate")
	@HttpCode(204)
	@ApiOperation({ summary: "Inativar serviço da empresa" })
	@UserType("COMPANY")
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
