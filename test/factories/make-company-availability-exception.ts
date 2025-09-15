import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	CompanyAvailabilityException,
	CompanyAvailabilityExceptionProps,
} from "@/modules/company-availability/domain/entities/company-availability-exception.entity";
import { faker } from "@faker-js/faker";

export function makeCompanyAvailabilityException(
	override: Partial<CompanyAvailabilityExceptionProps> = {},
	id?: UniqueEntityID,
) {
	const companyAvailability = CompanyAvailabilityException.create(
		{
			companyId: new UniqueEntityID().toString(),
			endDate: faker.date.soon(),
			startDate: faker.date.soon(),
			reason: faker.lorem.sentence(),
			...override,
		},
		id,
	);

	return companyAvailability;
}
