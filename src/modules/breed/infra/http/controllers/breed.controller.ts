import { BadRequestException, Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { ListBreedsUseCase } from "src/modules/breed/application/use-cases/list-breeds.use-case";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { BreedListResponse } from "../dtos/breed.response.dto";
import { ListBreedsPresenter } from "../presenters/list-breeds.presenter";

@ApiTags("Raças")
@Controller("breeds")
export class BreedController {
	constructor(private readonly listBreedsUseCase: ListBreedsUseCase) {}

	@Get()
	@Public()
	@ApiOperation({
		summary: "Listar todas as raças agrupadas por tipo de animal",
		operationId: "getAllBreeds",
	})
	@ZodResponse({ status: 200, type: BreedListResponse })
	async getAll(): Promise<BreedListResponse> {
		const result = await this.listBreedsUseCase.execute();
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return ListBreedsPresenter.present(result.value.items);
	}
}
