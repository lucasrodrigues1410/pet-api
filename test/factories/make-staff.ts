import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	Staff,
	staffRole,
} from "@/modules/staff/domain/entities/staff.entity";

export function makeStaff(override: Partial<Staff> = {}, id?: UniqueEntityID) {
	const staff = Staff.create(
		{
			companyId: new UniqueEntityID(),
			role: faker.helpers.arrayElement(staffRole),
			userId: new UniqueEntityID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...override,
		},
		id,
	);

	return staff;
}