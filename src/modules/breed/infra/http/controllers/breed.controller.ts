import { BadRequestException, Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ListBreedsUseCase } from "src/modules/breed/application/use-cases/list-breeds.use-case";
import { BreedPresenter } from "../presenters/breed.presenter";
import { BreedListResponse } from "../dtos/breed.response.dto";

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
	async getAll() {
		const result = await this.listBreedsUseCase.execute();
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return {
			items: result.value.breeds.map(BreedPresenter.toHTTP),
		};
	}
}
