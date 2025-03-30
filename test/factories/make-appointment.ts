import {
	Appointment,
	AppointmentProps,
	AppointmentStatus,
} from "@/modules/appointment/domain/entities/appointment.entity";
import { PrismaAppointementMapper } from "@/modules/appointment/infra/database/mapper/prisma-appointment.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { PrismaService } from "src/core/infra/prisma/prisma.service";

const statusAvailable = [
	"CANCELED",
	"COMPLETED",
	"CONFIRMED",
	"IN_PROGRESS",
	"NO_SHOW",
	"SCHEDULED",
] as AppointmentStatus[];

export function makeAppointment(
	override: Partial<Appointment> = {},
	id?: UniqueEntityID,
) {
	const appointment = Appointment.create(
		{
			startDate: faker.date.past(),
			endDate: faker.date.future(),
			status: faker.helpers.arrayElement(statusAvailable),
			notes: faker.lorem.sentence(),
			priceAtScheduling: faker.number.float({ min: 1, max: 100 }),
			companyId: new UniqueEntityID().toString(),
			serviceId: new UniqueEntityID().toString(),
			clientId: new UniqueEntityID().toString(),
			animalId: new UniqueEntityID().toString(),
			...override,
		},
		id,
	);

	return appointment;
}

@Injectable()
export class AppointmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismamakeAppointment(
		data: Partial<AppointmentProps> = {},
	): Promise<Appointment> {
		const appointment = makeAppointment(data);

		await this.prisma.appointment.create({
			data: PrismaAppointementMapper.toPrisma(appointment),
		});

		return appointment;
	}
}
