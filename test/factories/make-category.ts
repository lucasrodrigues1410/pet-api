import { faker } from "@faker-js/faker";
import {
	Category,
	CategoryProps,
} from "src/modules/category/domain/entities/category.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export function makeCategory(
	override: Partial<CategoryProps> = {},
	id?: UniqueEntityID,
) {
	const category = Category.create(
		{
			name: faker.commerce.department(),
			type: "petshop",
			description: faker.lorem.sentence(),
			...override,
		},
		id,
	);

	return category;
}