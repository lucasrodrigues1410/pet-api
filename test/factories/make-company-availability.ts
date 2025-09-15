import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	CompanyAvailability,
	daysOfWeek,
} from "@/modules/company-availability/domain/entities/company-availability.entity";

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
