import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import {
	Prisma,
	CompanyAvailability as PrismaCompanyAvailability,
} from "@prisma/client";
import { format } from "date-fns";

export class PrismaCompanyAvailabilityMapper {
	static toDomain(prismaPriceVariation: PrismaCompanyAvailability) {
		return CompanyAvailability.create(
			{
				companyId: new UniqueEntityID(prismaPriceVariation.companyId),
				day: prismaPriceVariation.day,
				startTime: format(prismaPriceVariation.startTime, "HH:mm"),
				endTime: format(prismaPriceVariation.endTime, "HH:mm"),
				lunchStartTime: format(prismaPriceVariation.lunchStartTime, "HH:mm"),
				lunchEndTime: format(prismaPriceVariation.lunchEndTime, "HH:mm"),
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
			lunchEndTime: new Date(companyAvailability.launchTime.endTime),
			lunchStartTime: new Date(companyAvailability.launchTime.startTime),
		};
	}
}
