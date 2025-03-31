import {
	CompanyAvailability,
	DaysOfWeek,
} from "@/modules/company-availability/domain/entities/company-availability.entity";
import { faker } from "@faker-js/faker";
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