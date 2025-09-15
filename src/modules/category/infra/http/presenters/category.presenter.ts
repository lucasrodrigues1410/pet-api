import { Category } from "@/modules/category/domain/entities/category.entity";

export class CategoryPresenter {
	static present(category: Category) {
		return {
			id: category.id.toString(),
			name: category.name,
			type: category.type,
			description: category.description,
		};
	}

	static presentList(categories: Category[]) {
		return { items: categories.map((category) => this.present(category)) };
	}
}
