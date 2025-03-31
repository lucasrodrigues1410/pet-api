import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import {
	Prisma,
	CompanyAvailability as PrismaCompanyAvailability,
} from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class PrismaCompanyAvailabilityMapper {
	static toDomain(prismaPriceVariation: PrismaCompanyAvailability) {
		return CompanyAvailability.create(
			{
				companyId: prismaPriceVariation.companyId,
				day: prismaPriceVariation.day,
				startTime: prismaPriceVariation.startTime.toString(),
				endTime: prismaPriceVariation.endTime.toString(),
				createdAt: prismaPriceVariation.createdAt,
				updatedAt: prismaPriceVariation.updatedAt,
			},
			new UniqueEntityID(prismaPriceVariation.id),
		);
	}

	static toPrisma(
		companyAvailability: CompanyAvailability,
	): Prisma.CompanyAvailabilityUncheckedCreateInput {
		return {
			id: companyAvailability.id.toString(),
			companyId: companyAvailability.companyId,
			day: companyAvailability.day,
			startTime: new Date(companyAvailability.startTime),
			endTime: new Date(companyAvailability.endTime),
		};
	}
}
