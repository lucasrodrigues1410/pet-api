import {
	Prisma,
	Asset as PrismaAsset,
	Company as PrismaCompany,
} from "prisma/generated/client";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";

export class PrismaCompanyMapper {
	static toDomain(
		prismaCompany: PrismaCompany & {
			logo?: PrismaAsset | null;
		},
	): Company {
		return Company.create(
			{
				name: prismaCompany.name,
				contact: prismaCompany.contact || undefined,
				description: prismaCompany.description || undefined,
				logo: prismaCompany.logo
					? PrismaAssetMapper.toDomain(prismaCompany.logo)
					: undefined,
				averageRating: prismaCompany.averageRating,
				ratingCount: prismaCompany.ratingCount,
				locationId: new UniqueEntityID(prismaCompany.locationId),
			},
			new UniqueEntityID(prismaCompany.id),
		);
	}

	static toPrisma(company: Company): Prisma.CompanyUncheckedCreateInput {
		return {
			id: company.id.toString(),
			name: company.name,
			contact: company.contact,
			description: company.description,
			averageRating: company.averageRating || 0,
			ratingCount: company.ratingCount || 0,
			locationId: company.locationId.toString(),
		};
	}
}
