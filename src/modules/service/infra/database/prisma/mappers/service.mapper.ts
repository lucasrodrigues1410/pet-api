import {
	Prisma,
	Category as PrismaCategory,
	Service as PrismaSerivce,
	Company as PrismaCompany,
} from "@prisma/client";
import { Category } from "src/modules/category/domain/entities/category.entity";
import { CompanyPrismaMapper } from "src/modules/company/infra/database/prisma/mappers/company.mapper";
import { Service } from "src/modules/service/domain/entities/service.entity";

export class ServicePrismaMapper {
	static toDomain(
		prismaService: PrismaSerivce & {
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
						category.id,
					),
				)
			: [];

		const company = prismaService.company
			? CompanyPrismaMapper.toDomain(prismaService.company)
			: undefined;

		return Service.create(
			{
				description: prismaService.description,
				price: prismaService.price.toNumber(),
				duration: prismaService.duration,
				isActive: prismaService.isActive,
				name: prismaService.name,
				companyId: prismaService.companyId,
				categories,
				company,
			},
			prismaService.id,
		);
	}

	static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
		return {
			description: service.description,
			price: service.price,
			duration: service.duration,
			isActive: service.isActive,
			name: service.name,
			companyId: service.companyId,
			details: service.details as Prisma.JsonObject,
		};
	}
}
