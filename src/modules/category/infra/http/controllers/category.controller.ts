import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { ListAllCategoriesUseCase } from "@/modules/category/application/use-cases/list-all-categories.use-case";
import { CategoryResponse } from "../dtos/category.response.dto";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
	constructor(
		private readonly listAllCategoriesUseCase: ListAllCategoriesUseCase,
	) {}

	@Get()
	@ApiOperation({ summary: "Listar todas as categorias",operationId: "listAllCategories" })
	@ZodResponse({
		status: 200,
		type: CategoryResponse,
	})
	async listAll() {
		const categories = await this.listAllCategoriesUseCase.execute();
		return {
			items: categories.map((category) => category.toObject()),
		};
	}
}
