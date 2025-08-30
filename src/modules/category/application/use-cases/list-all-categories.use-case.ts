import { Injectable } from "@nestjs/common";
import { Category } from "@/modules/category/domain/entities/category.entity";
import { CategoryRepository } from "@/modules/category/domain/repositories/category.repository";

@Injectable()
export class ListAllCategoriesUseCase {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	async execute(): Promise<Category[]> {
		return this.categoryRepository.findAll();
	}
}
