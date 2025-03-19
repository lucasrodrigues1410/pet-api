import { Prisma, Company as PrismaCompany } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Company } from "src/modules/company/domain/entities/company.entity";

export class PrismaCompanyMapper {
	static toDomain(prismaCompany: PrismaCompany): Company {
		return Company.create(
			{
				name: prismaCompany.name,
				address: prismaCompany.address || undefined,
				contact: prismaCompany.contact || undefined,
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
		};
	}
}
