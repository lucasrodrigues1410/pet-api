import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { add } from "date-fns";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	Appointment,
	AppointmentProps,
	CoatType,
} from "@/modules/appointment/domain/entities/appointment.entity";
import { PrismaAppointmentMapper } from "@/modules/appointment/infra/database/mapper/prisma-appointment.mapper";

export function makeAppointment(
	override: Partial<Appointment> = {},
	id?: UniqueEntityID,
) {
	const appointment = Appointment.create(
		{
			startDate: add(new Date(), { minutes: 1 }),
			endDate: add(new Date(), { hours: 1 }),
			status: "scheduled", // Always use SCHEDULED so it can be canceled
			price: faker.number.float({ min: 1, max: 100 }),
			serviceId: new UniqueEntityID(),
			clientId: new UniqueEntityID(),
			staffId: new UniqueEntityID(),
			coatType: faker.helpers.arrayElement<CoatType>([
				"short",
				"medium",
				"long",
				"curly",
			]),
			animalId: new UniqueEntityID(),
			companyId: new UniqueEntityID(),
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
