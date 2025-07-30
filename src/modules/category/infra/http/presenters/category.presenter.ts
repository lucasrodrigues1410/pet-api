import { z } from "zod";
import { Category } from "@/modules/category/domain/entities/category.entity";
import { categoryDto } from "../dtos/category.dto";

export class CategoryPresenter {
	static toHTTP(category: Category): z.infer<typeof categoryDto> {
		return {
			id: category.id.toString(),
			email: category.name,
			description: category.description ?? undefined,
			type: category.type,
		};
	}
}
