import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	AppointmentIntent,
	AppointmentIntentProps,
} from "@/modules/appointment/domain/entities/appointment-intent.entity";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { PrismaAppointmentIntentMapper } from "@/modules/appointment/infra/database/mapper/prisma-appointment-intent.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";

export function makeAppointmentIntent(
	override: Partial<Appointment> = {},
	id?: UniqueEntityID,
) {
	const appointment = AppointmentIntent.create(
		{
			startDate: faker.date.past(),
			endDate: faker.date.future(),
			price: faker.number.float({ min: 1, max: 100 }),
			serviceId: new UniqueEntityID(),
			clientId: new UniqueEntityID(),
			animalId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return appointment;
}

@Injectable()
export class AppointmentIntentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismamakeAppointmentIntent(
		data: Partial<AppointmentIntentProps> = {},
	): Promise<AppointmentIntent> {
		const appointment = makeAppointmentIntent(data);

		await this.prisma.appointmentIntent.create({
			data: PrismaAppointmentIntentMapper.toPersistence(appointment),
		});

		return appointment;
	}
}
