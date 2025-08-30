import { Category } from "src/modules/category/domain/entities/category.entity";
import { CategoryRepository } from "src/modules/category/domain/repositories/category.repository";

export class InMemoryCategoryRepository implements CategoryRepository {
	public items: Category[] = [];

	async findAll(): Promise<Category[]> {
		return this.items.sort((a, b) => a.name.localeCompare(b.name));
	}
}
