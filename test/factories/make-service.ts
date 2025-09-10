import { faker } from "@faker-js/faker";
import {
	Service,
} from "src/modules/service/domain/entities/service.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export function makeService(
	override: Partial<Service> = {},
	id?: UniqueEntityID,
) {
	const student = Service.create(
		{
			name: faker.commerce.productName(),
			description: faker.datatype.boolean({ probability: 0.8 })
				? faker.lorem.sentence()
				: null,
			price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
			isActive: faker.datatype.boolean(),
			duration: 10,
			companyId: new UniqueEntityID(),
			details: {},
			...override,
		},
		id,
	);

	return student;
}