import {
	Prisma,
	Company as PrismaCompany,
} from "@prisma/client";
import { Company } from "src/modules/company/domain/entities/company.entity";

export class CompanyPrismaMapper {
	static toDomain(
		prismaCompany: PrismaCompany,
	): Company {
		return Company.create({
			name: prismaCompany.name,
			address: prismaCompany.address || undefined,
			contact: prismaCompany.contact || undefined,
		}, prismaCompany.id);
	}

	static toPrisma(animal: Company): Prisma.CompanyUncheckedCreateInput {
		return {
			id: animal.id,
			name: animal.name,
			address: animal.address,
			contact: animal.contact,
		};
	}
}
