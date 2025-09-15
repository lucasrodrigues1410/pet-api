import { faker } from "@faker-js/faker";
import {
	Company,
	CompanyProps,
} from "src/modules/company/domain/entities/company.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export function makeCompany(
	override: Partial<CompanyProps> = {},
	id?: UniqueEntityID,
) {
	const company = Company.create(
		{
			name: faker.company.name(),
			contact: faker.phone.number(),
			locationId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return company;
}