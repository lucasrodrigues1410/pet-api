import { CompanyAvailabilityException, CompanyAvailabilityExceptionProps } from "@/modules/company-availability/domain/entities/company-availability-exception.entity";
import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

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