import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import {
	Prisma,
	CompanyAvailability as PrismaCompanyAvailability,
} from "@prisma/client";
import { format } from "date-fns";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class PrismaCompanyAvailabilityMapper {
	static toDomain(prismaPriceVariation: PrismaCompanyAvailability) {
		return CompanyAvailability.create(
			{
				companyId: new UniqueEntityID(prismaPriceVariation.companyId),
				day: prismaPriceVariation.day,
				startTime: format(prismaPriceVariation.startTime, "HH:mm"),
				endTime: format(prismaPriceVariation.endTime, "HH:mm"),
			},
			new UniqueEntityID(prismaPriceVariation.id),
		);
	}

	static toPrisma(
		companyAvailability: CompanyAvailability,
	): Prisma.CompanyAvailabilityUncheckedCreateInput {
		return {
			id: companyAvailability.id.toString(),
			companyId: companyAvailability.companyId.toString(),
			day: companyAvailability.day,
			startTime: new Date(companyAvailability.timeRange.startTime),
			endTime: new Date(companyAvailability.timeRange.endTime),
		};
	}
}
