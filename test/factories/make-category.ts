import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import {
	Category,
	CategoryProps,
} from "src/modules/category/domain/entities/category.entity";
import { PrismaCategoryMapper } from "src/modules/category/infra/database/mappers/prisma-category.mapper";
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

@Injectable()
export class CategoryFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaCategory(data: Partial<CategoryProps> = {}): Promise<Category> {
		const category = makeCategory(data);

		await this.prisma.category.create({
			data: PrismaCategoryMapper.toPrisma(category),
		});

		return category;
	}
}
