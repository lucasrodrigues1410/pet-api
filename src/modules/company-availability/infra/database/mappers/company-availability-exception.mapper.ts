import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { CompanyAvailabilityException } from "@/modules/company-availability/domain/entities/company-availability-exception.entity";
import {
	Prisma,
	CompanyAvailabilityException as PrismaCompanyAvailabilityException,
} from "@prisma/client";

export class PrismaCompanyAvailabilityExceptionMapper {
	static toDomain(prismaPriceVariation: PrismaCompanyAvailabilityException) {
		return CompanyAvailabilityException.create(
			{
				companyId: prismaPriceVariation.companyId,
				endDate: prismaPriceVariation.endDate,
				startDate: prismaPriceVariation.startDate,
				reason: prismaPriceVariation.reason ?? undefined,
			},
			new UniqueEntityID(prismaPriceVariation.id),
		);
	}

	static toPrisma(
		companyAvailabilityExcetion: CompanyAvailabilityException,
	): Prisma.CompanyAvailabilityExceptionUncheckedCreateInput {
		return {
			id: companyAvailabilityExcetion.id.toString(),
			companyId: companyAvailabilityExcetion.companyId,
			startDate: new Date(companyAvailabilityExcetion.startDate),
			endDate: new Date(companyAvailabilityExcetion.endDate),
			reason: companyAvailabilityExcetion.reason,
		};
	}
}
