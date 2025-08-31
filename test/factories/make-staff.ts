import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	Staff,
	StaffProps,
	staffRole,
} from "@/modules/staff/domain/entities/staff.entity";
import { PrismaStaffMapper } from "@/modules/staff/infra/database/mappers/prisma-staff.mapper";

export function makeStaff(override: Partial<Staff> = {}, id?: UniqueEntityID) {
	const staff = Staff.create(
		{
			companyId: new UniqueEntityID(),
			role: faker.helpers.arrayElement(staffRole),
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
