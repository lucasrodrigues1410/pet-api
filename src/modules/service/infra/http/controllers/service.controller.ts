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
import { ServiceDetailsResponse } from "../dtos/service-details.response.dto";
import { ServiceResponseList } from "../dtos/service.response.dto";
import { ServiceDetailsPresenter } from "../presenters/service-details.presenter";
import { ServicePresenter } from "../presenters/service.presenter";

@ApiTags("Serviços")
@Controller("service")
export class ServiceController {
	constructor(
		private readonly listServicesByCompanyUseCase: ListServicesByCompanyUseCase,
		private readonly getServiceByIdUseCase: GetServiceByIdUseCase,
	) {}

	@Get(":id")
	@ApiOperation({ summary: "Buscar serviço por ID" })
	@ApiResponse({
		status: 200,
		type: ServiceDetailsResponse,
	})
	async getServiceById(@Param("id") id: string) {
		const result = await this.getServiceByIdUseCase.execute({ id });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		return ServiceDetailsPresenter.toHTTP(result.value.service);
	}

	@Get("/company/:id")
	@ApiOperation({ summary: "Listar serviços por empresa" })
	@ApiResponse({
		status: 200,
		type: ServiceResponseList,
	})
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
