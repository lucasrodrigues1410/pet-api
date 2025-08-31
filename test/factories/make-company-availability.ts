import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import {
	CompanyAvailability,
	CompanyAvailabilityProps,
	daysOfWeek,
} from "@/modules/company-availability/domain/entities/company-availability.entity";
import { PrismaCompanyAvailabilityMapper } from "@/modules/company-availability/infra/database/mappers/company-availability.mapper";

export function makeCompanyAvailability(
	override: Partial<
		Omit<CompanyAvailability, "timeRange"> & {
			startTime: string;
			endTime: string;
		}
	> = {},
	id?: UniqueEntityID,
) {
	const companyAvailability = CompanyAvailability.create(
		{
			companyId: new UniqueEntityID(),
			day: faker.helpers.arrayElement(daysOfWeek),
			endTime: "17:00",
			startTime: "08:00",
			lunchEndTime: "13:00",
			lunchStartTime: "12:00",
			...override,
		},
		id,
	);

	return companyAvailability;
}

@Injectable()
export class CompanyAvailabilityFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaBreed(
		data: Partial<CompanyAvailabilityProps> = {},
	): Promise<CompanyAvailability> {
		const exception = makeCompanyAvailability(data);

		await this.prisma.companyAvailability.create({
			data: PrismaCompanyAvailabilityMapper.toPrisma(exception),
		});

		return exception;
	}
}
