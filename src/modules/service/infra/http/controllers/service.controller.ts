import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "src/modules/auth/infra/http/decorators/public.decorator";
import { ListActiveServicesUseCase } from "../../../application/use-cases/list-active-services.use-case";
import { ListActiveServiceResponseDto } from "../../../application/dtos/list-active-service.dto";
import { ServiceByIdResponseDTO } from "src/modules/service/application/dtos/service-by-id-response.dto";
import { GetServiceByIdUseCase } from "src/modules/service/application/use-cases/get-service-by-id.use-case";

@ApiTags("Serviços")
@Controller("service")
export class ServiceController {
	constructor(
		private readonly listActiveServicesUseCase: ListActiveServicesUseCase,
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
	async getServiceById(@Param("id") id: number) {
		const result = await this.getServiceByIdUseCase.execute({ id });
		if (result.isLeft()) {
			throw new NotFoundException();
		}

		const service = result.value.service;
		const company = service.company;
		const categories = service.categories?.map((category) => ({
			id: category.id,
			name: category.name,
			type: category.type,
		})) || []

		return {
			id: service.id,
			name: service.name,
			description: service.description || null,
			price: service.price,
			categories,
			company,
		};
	}

	@ApiOperation({ summary: "Listar serviços ativos" })
	@ApiResponse({
		status: 200,
		description: "Lista de serviços ativos",
		type: ListActiveServiceResponseDto,
	})
	@Get("active")
	@Public()
	@HttpCode(HttpStatus.OK)
	async listActiveServices() {
		const result = await this.listActiveServicesUseCase.execute();
		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return {
			results: result.value.services.map((service) => ({
				id: service.id,
				name: service.name,
				description: service.description,
				price: service.price,
				categories: service.categories?.map((category) => ({
					id: category.id,
					name: category.name,
					type: category.type,
				})),
			})),
		};
	}
}
