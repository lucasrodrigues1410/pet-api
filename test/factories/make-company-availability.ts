import { PrismaService } from "@/core/infra/prisma/prisma.service";
import {
	CompanyAvailability,
	CompanyAvailabilityProps,
	DaysOfWeek,
} from "@/modules/company-availability/domain/entities/company-availability.entity";
import { PrismaCompanyAvailabilityMapper } from "@/modules/company-availability/infra/database/mappers/company-availability.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { format } from "date-fns";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export function makeCompanyAvailability(
	override: Partial<CompanyAvailability> = {},
	id?: UniqueEntityID,
) {
	const companyAvailability = CompanyAvailability.create(
		{
			companyId: new UniqueEntityID().toString(),
			day: faker.helpers.arrayElement(Object.values(DaysOfWeek)),
			endTime: format(faker.date.soon(), "HH:mm:ss"),
			startTime: format(faker.date.past(), "HH:mm:ss"),
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
