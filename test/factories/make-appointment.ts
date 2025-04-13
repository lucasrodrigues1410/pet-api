import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	Appointment,
	AppointmentProps,
	AppointmentStatus,
	CoatType,
} from "@/modules/appointment/domain/entities/appointment.entity";
import { PrismaAppointmentMapper } from "@/modules/appointment/infra/database/mapper/prisma-appointment.mapper";
import { faker } from "@faker-js/faker";
import { O } from "@faker-js/faker/dist/airline-CBNP41sR";
import { Injectable } from "@nestjs/common";
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
			price: faker.number.float({ min: 1, max: 100 }),
			serviceId: new UniqueEntityID(),
			staffId: new UniqueEntityID(),
			coatType: faker.helpers.arrayElement(Object.values(CoatType)),
			animalId: new UniqueEntityID(),
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
			data: PrismaAppointmentMapper.toPersistence(appointment),
		});

		return appointment;
	}
}
