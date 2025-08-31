import { Module } from "@nestjs/common";
import { ListAllCategoriesUseCase } from "./application/use-cases/list-all-categories.use-case";
import { CategoryRepository } from "./domain/repositories/category.repository";
import { PrismaCategoryRepository } from "./infra/database/repositories/prisma-category.repository";
import { CategoryController } from "./infra/http/controllers/category.controller";

@Module({
	controllers: [CategoryController],
	providers: [
		ListAllCategoriesUseCase,
		{
			provide: CategoryRepository,
			useClass: PrismaCategoryRepository,
		},
	],
	exports: [
		{
			provide: CategoryRepository,
			useClass: PrismaCategoryRepository,
		},
	],
})
export class CategoryModule {}
