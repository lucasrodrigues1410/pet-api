import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { CategoryRepository } from "@/modules/category/domain/repositories/category.repository";
import { PrismaCategoryMapper } from "../mappers/prisma-category.mapper";

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		const categories = await this.prisma.category.findMany({
			orderBy: { name: "asc" },
		});

		return categories.map(PrismaCategoryMapper.toDomain);
	}
}
