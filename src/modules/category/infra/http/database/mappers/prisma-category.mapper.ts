import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Category } from "@/modules/category/domain/entities/category.entity";
import { Prisma, Category as PrismaCategory } from "@/prisma-generated/client";

export class PrismaCategoryMapper {
	static toDomain(prismaCategory: PrismaCategory): Category {
		return Category.create(
			{
				name: prismaCategory.name,
				type: prismaCategory.type,
				description: prismaCategory.description,
			},
			new UniqueEntityID(prismaCategory.id),
		);
	}

	static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
		return {
			id: category.id.toString(),
			name: category.name,
			type: category.type,
			description: category.description,
		};
	}
}
