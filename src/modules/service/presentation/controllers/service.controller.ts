import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "src/modules/auth/presentation/decorators/public.decorator";
import { ListActiveServicesUseCase } from "../../application/use-cases/list-active-services.use-case";
import { ListActiveServiceResponseDto } from "../dtos/list-active-service.dto";

@Controller("service")
export class ServiceController {
	constructor(
		private readonly listActiveServicesUseCase: ListActiveServicesUseCase,
	) {}

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
