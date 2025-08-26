import { Prisma } from "prisma/generated/client";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";

type PrismaCompany = Prisma.CompanyGetPayload<{
	include: {
		logo: true;
	};
}>;

export class PrismaCompanyMapper {
	static toDomain(prismaCompany: PrismaCompany): Company {
		return Company.create(
			{
				name: prismaCompany.name,
				address: prismaCompany.address || undefined,
				contact: prismaCompany.contact || undefined,
				description: prismaCompany.description || undefined,
				logo: prismaCompany.logo
					? PrismaAssetMapper.toDomain(prismaCompany.logo)
					: undefined,
			},
			new UniqueEntityID(prismaCompany.id),
		);
	}

	static toPrisma(animal: Company): Prisma.CompanyUncheckedCreateInput {
		return {
			id: animal.id.toString(),
			name: animal.name,
			address: animal.address,
			contact: animal.contact,
			description: animal.description,
		};
	}
}
