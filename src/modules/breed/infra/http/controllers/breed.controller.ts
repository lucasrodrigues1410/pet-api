import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ListBreedsUseCase } from "src/modules/breed/application/use-cases/list-breeds.use-case";
import { BreedListResponse, BreedListResponseWithPagination } from "../dtos/breed.response.dto";
import { BreedPresenter } from "../presenters/breed.presenter";
import { ListBreedsQueryDto } from "../dtos/list-breeds.dto";
import { PaginationPresenter } from "@/core/infra/presenters/pagination.presenter";

@ApiTags("Raças")
@Controller("breeds")
export class BreedController {
	constructor(private readonly listBreedsUseCase: ListBreedsUseCase) {}

	@Get()
	@ApiOperation({ summary: "Listar todas as raças" })
	@ApiResponse({
		status: 200,
		type: BreedListResponseWithPagination,
	})
	async getAll(@Query() query: ListBreedsQueryDto): Promise<BreedListResponse> {
		const result = await this.listBreedsUseCase.execute(query);
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return PaginationPresenter.toHTTP({
			...result.value,
			items: result.value.items.map(BreedPresenter.toHTTP),
		});
	}
}
