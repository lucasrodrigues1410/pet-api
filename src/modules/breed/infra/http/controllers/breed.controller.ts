import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ListBreedsUseCase } from "src/modules/breed/application/use-cases/list-breeds.use-case";
import { BreedListResponse } from "../dtos/breed.response.dto";
import { BreedPresenter } from "../presenters/breed.presenter";
import { ListBreedsQueryDto } from "../dtos/list-breeds.dto";

@ApiTags("Raças")
@Controller("breeds")
export class BreedController {
	constructor(private readonly listBreedsUseCase: ListBreedsUseCase) {}

	@Get()
	@ApiOperation({ summary: "Listar todas as raças" })
	@ApiResponse({
		status: 200,
		type: BreedListResponse,
	})
	async getAll(@Query() query: ListBreedsQueryDto): Promise<BreedListResponse> {
		const result = await this.listBreedsUseCase.execute(query);
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return {
			items: result.value.map(BreedPresenter.toHTTP)
		}
	}
}
