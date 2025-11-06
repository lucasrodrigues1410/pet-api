import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	Put,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { CreateServiceUseCase } from "@/modules/service/application/use-cases/create-service.use-case";
import { UpdateServiceUseCase } from "@/modules/service/application/use-cases/edit-service.use-case";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { DeactivateServiceUseCase } from "../../../application/use-cases/deactivate-service.use-case";
import { GetServiceByIdUseCase } from "../../../application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "../../../application/use-cases/list-services-by-company.use-case";
import { CreateServiceRequestDto } from "../dtos/create-service.dto";
import { ServiceResponseList } from "../dtos/service.dto";
import { ServiceDetailsResponse } from "../dtos/service-details.dto";
import { UpdateServiceRequestDto } from "../dtos/update-service.dto";
import { ServiceDetailsPresenter } from "../presenters/service-details.presenter";
import { ServiceListPresenter } from "../presenters/service-list.presenter";

@ApiTags("Serviços")
@Controller("services")
export class ServiceController {
	constructor(
		private readonly getServiceByIdUseCase: GetServiceByIdUseCase,
		private readonly listServicesByCompanyUseCase: ListServicesByCompanyUseCase,
		private readonly deactivateServiceUseCase: DeactivateServiceUseCase,
		private readonly createServiceUseCase: CreateServiceUseCase,
		private readonly updateServiceUseCase: UpdateServiceUseCase,
	) {}

	@Get("/company/:companyId")
	@ApiOperation({
		summary: "Listar serviços por empresa",
		operationId: "listServicesByCompany",
	})
	@ZodResponse({ status: 200, type: ServiceResponseList })
	async listServicesByCompany(
		@User("sub") userId: string,
		@Param("companyId") companyId: string,
	) {
		const result = await this.listServicesByCompanyUseCase.execute({
			companyId,
			userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return ServiceListPresenter.present(result.value.services);
	}

	@Patch("/:id/company/:companyId/deactivate")
	@HttpCode(204)
	@ApiOperation({
		summary: "Inativar serviço da empresa",
		operationId: "deactivateService",
	})
	async deactivateService(
		@Param("id") id: string,
		@Param("companyId") companyId: string,
		@User("sub") userId: string,
	) {
		const result = await this.deactivateServiceUseCase.execute({
			id,
			userId,
			companyId,
		});

		if (result.isLeft()) {
			throw new NotFoundException(result.value.message);
		}
	}

	@Post("company/:companyId")
	@ApiOperation({ summary: "Criar serviço", operationId: "createService" })
	@HttpCode(201)
	async createService(
		@Body() body: CreateServiceRequestDto,
		@User("sub") userId: string,
		@Param("companyId") companyId: string,
	) {
		const result = await this.createServiceUseCase.execute({
			...body,
			categoryIds: body.categoryId ? [body.categoryId] : undefined,
			userId,
			companyId,
		});

		if (result.isLeft()) {
			if (result.value instanceof NotAllowedError) {
				throw new ForbiddenException(result.value.message);
			}
			throw new BadRequestException();
		}
	}

	@Put(":id/company/:companyId")
	@ApiOperation({ summary: "Atualizar serviço", operationId: "updateService" })
	@HttpCode(201)
	async updateService(
		@Body() body: UpdateServiceRequestDto,
		@User("sub") userId: string,
		@Param("companyId") companyId: string,
		@Param("id") id: string,
	) {
		const result = await this.updateServiceUseCase.execute({
			...body,
			serviceId: id,
			categoryIds: body.categoryId ? [body.categoryId] : undefined,
			userId,
			companyId,
		});

		if (result.isLeft()) {
			if (result.value instanceof NotAllowedError) {
				throw new ForbiddenException(result.value.message);
			}
			throw new BadRequestException();
		}
	}

	@Get("/:id")
	@ApiOperation({
		summary: "Buscar serviço por ID",
		operationId: "getServiceById",
	})
	@ZodResponse({ status: 200, type: ServiceDetailsResponse })
	async getServiceById(@Param("id") id: string) {
		const result = await this.getServiceByIdUseCase.execute({ id });

		if (result.isLeft()) {
			throw new NotFoundException(result.value.message);
		}

		return ServiceDetailsPresenter.present(result.value.service);
	}
}
