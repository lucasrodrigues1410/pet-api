import { PrismaCompanyAvailabilityExceptionMapper } from "@/modules/company-availability/infra/database/mappers/company-availability-exception.mapper";
import { PrismaCompanyAvailabilityMapper } from "@/modules/company-availability/infra/database/mappers/company-availability.mapper";
import {
	Prisma,
	Company as PrismaCompany,
	CompanyAvailability as PrismaCompanyAvailability,
	CompanyAvailabilityException as PrismaCompanyAvailabilityException,
} from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Company } from "src/modules/company/domain/entities/company.entity";

export class PrismaCompanyMapper {
	static toDomain(
		prismaCompany: PrismaCompany & {
			companyAvailability?: PrismaCompanyAvailability[];
			companyAvailabilityExceptions?: PrismaCompanyAvailabilityException[];
		},
	): Company {
		const companyAvailabilityDomain = prismaCompany.companyAvailability?.map(
			PrismaCompanyAvailabilityMapper.toDomain,
		);
		const companyAvailabilityExceptionsDomain =
			prismaCompany.companyAvailabilityExceptions?.map(
				PrismaCompanyAvailabilityExceptionMapper.toDomain,
			);

		return Company.create(
			{
				name: prismaCompany.name,
				address: prismaCompany.address || undefined,
				contact: prismaCompany.contact || undefined,
				availability: companyAvailabilityDomain,
				availabilityExceptions: companyAvailabilityExceptionsDomain,
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
