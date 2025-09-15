import { Category } from "@/modules/category/domain/entities/category.entity";
import { CategoryPresenter } from "./category.presenter";

export class ListCategoriesPresenter {
	static present(categories: Category[]) {
		return CategoryPresenter.presentList(categories);
	}
}
