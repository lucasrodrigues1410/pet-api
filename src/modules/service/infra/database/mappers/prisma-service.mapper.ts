import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	Prisma,
	Category as PrismaCategory,
	Company as PrismaCompany,
	Service as PrismaService,
} from "@prisma/client";
import { Category } from "src/modules/category/domain/entities/category.entity";
import { PrismaCompanyMapper } from "src/modules/company/infra/database/mappers/prisma-company.mapper";
import { Service } from "src/modules/service/domain/entities/service.entity";

export class PrismaServiceMapper {
	static toDomain(
		prismaService: PrismaService & {
			categories?: PrismaCategory[];
			company?: PrismaCompany;
		},
	): Service {
		const categories = prismaService.categories
			? prismaService.categories.map((category) =>
					Category.create(
						{
							name: category.name,
							description: category.description,
							type: category.type,
						},
						new UniqueEntityID(category.id),
					),
				)
			: [];

		const company = prismaService.company
			? PrismaCompanyMapper.toDomain(prismaService.company)
			: undefined;

		return Service.create(
			{
				description: prismaService.description,
				price: prismaService.price.toNumber(),
				duration: prismaService.duration,
				isActive: prismaService.isActive,
				name: prismaService.name,
				capacity: prismaService.capacity ?? undefined,
				companyId: new UniqueEntityID(prismaService.companyId),
				categories,
				company,
			},
			new UniqueEntityID(prismaService.id),
		);
	}

	static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
		return {
			description: service.description,
			price: service.price,
			duration: service.duration,
			isActive: service.isActive,
			name: service.name,
			companyId: service.companyId.toString(),
			capacity: service.capacity,
			details: service.details as Prisma.JsonObject,
		};
	}
}
