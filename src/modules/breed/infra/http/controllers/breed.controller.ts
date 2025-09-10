import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { ListBreedsUseCase } from "src/modules/breed/application/use-cases/list-breeds.use-case";
import { BreedListResponse } from "../dtos/breed.response.dto";
import { ListBreedsQueryDto } from "../dtos/list-breeds.dto";

@ApiTags("Raças")
@Controller("breeds")
export class BreedController {
	constructor(private readonly listBreedsUseCase: ListBreedsUseCase) {}

	@Get()
	@ApiOperation({
		summary: "Listar todas as raças",
		operationId: "getAllBreeds",
	})
	@ZodResponse({ status: 200, type: BreedListResponse })
	async getAll(@Query() query: ListBreedsQueryDto): Promise<BreedListResponse> {
		const result = await this.listBreedsUseCase.execute(query);
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return { items: result.value.items.map((i) => i.toObject()) };
	}
}
