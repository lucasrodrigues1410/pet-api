import { BadRequestException, Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ListBreedsResponseDto } from "src/modules/breed/infra/http/dtos/list-breeds.dto";
import { ListBreedsUseCase } from "src/modules/breed/application/use-cases/list-breeds.use-case";

@ApiTags("Raças")
@Controller("breeds")
export class BreedController {
	constructor(private readonly listBreedsUseCase: ListBreedsUseCase) {}

	@ApiOperation({ summary: "Listar todas as raças" })
	@ApiOkResponse({
		description: "Raças listadas com sucesso",
		type: ListBreedsResponseDto,
	})
	@Get()
	async getAll() {
		const result = await this.listBreedsUseCase.execute();
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return result.value.breeds.map((breed) => ({
			id: breed.id,
			name: breed.name,
		}));
	}
}
