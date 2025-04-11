import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "src/modules/auth/infra/http/decorators/public.decorator";
import { GetServiceByIdUseCase } from "src/modules/service/application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "src/modules/service/application/use-cases/list-services-by-company.use-case";
import { ListServicesByCompanyResponseDto } from "src/modules/service/infra/http/dtos/list-services-by-company.response.dto";
import { ServiceByIdResponseDTO } from "src/modules/service/infra/http/dtos/service-by-id-response.dto";
import { ServicePresenter } from "../presenters/service.presenter";

@ApiTags("Serviços")
@Controller("service")
export class ServiceController {
	constructor(
		private readonly listServicesByCompanyUseCase: ListServicesByCompanyUseCase,
		private readonly getServiceByIdUseCase: GetServiceByIdUseCase,
	) {}

	@ApiOperation({ summary: "Buscar serviço por ID" })
	@ApiResponse({
		status: 200,
		description: "Serviço encontrado",
		type: ServiceByIdResponseDTO,
	})
	@ApiResponse({
		status: 404,
		description: "Serviço não encontrado",
	})
	@Get(":id")
	async getServiceById(@Param("id") id: string) {
		const result = await this.getServiceByIdUseCase.execute({ id });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		const service = result.value.service;
		return {
			item: ServicePresenter.toHTTP(service)
		};
	}

	@ApiOperation({ summary: "Listar serviços por empresa" })
	@ApiResponse({
		status: 200,
		description: "Lista de serviços encontrada",
		type: ListServicesByCompanyResponseDto,
	})
	@Get("/company/:id")
	@Public()
	async listServicesByCompany(@Param("id") companyId: string) {
		const result = await this.listServicesByCompanyUseCase.execute({
			companyId,
		});
		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return {
			items: result.value.services.map(ServicePresenter.toHTTP),
		};
	}
}
