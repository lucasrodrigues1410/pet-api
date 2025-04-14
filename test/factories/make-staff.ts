import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	Staff,
	StaffProps,
	StaffRole,
} from "@/modules/staff/domain/entities/staff.entity";
import { PrismaStaffMapper } from "@/modules/staff/infra/database/mappers/prisma-staff.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import {
	Animal,
	AnimalProps,
} from "src/modules/animal/domain/entities/animal.entity";
import { AnimalPrismaMapper } from "src/modules/animal/infra/database/mappers/prisma-animal.mapper";

export function makeStaff(override: Partial<Staff> = {}, id?: UniqueEntityID) {
	const staff = Staff.create(
		{
			companyId: new UniqueEntityID(),
			role: faker.helpers.arrayElement(Object.values(StaffRole)),
			userId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return staff;
}

@Injectable()
export class StaffFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaStaff(data: Partial<StaffProps> = {}): Promise<Staff> {
		const staff = makeStaff(data);

		await this.prisma.userCompany.create({
			data: PrismaStaffMapper.toPersistence(staff),
		});

		return staff;
	}
}
