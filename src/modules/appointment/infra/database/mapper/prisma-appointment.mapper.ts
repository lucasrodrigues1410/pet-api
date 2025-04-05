import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { Prisma, Appointment as PrismaAppointment } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class PrismaAppointmentMapper {
	static toDomain(prismaAppointment: PrismaAppointment): Appointment {
		return Appointment.create(
			{
				animalId: new UniqueEntityID(prismaAppointment.animalId),
				clientId: new UniqueEntityID(prismaAppointment.clientId),
				serviceId: new UniqueEntityID(prismaAppointment.serviceId),
				startDate: prismaAppointment.startDate,
				endDate: prismaAppointment.endDate,
				price: prismaAppointment.price.toNumber(),
				status: prismaAppointment.status,
				paymentId: new UniqueEntityID(prismaAppointment.paymentId),
			},
			new UniqueEntityID(prismaAppointment.id),
		);
	}

	static toPersistence(
		appointment: Appointment,
	): Prisma.AppointmentUncheckedCreateInput {
		return {
			animalId: appointment.animalId.toString(),
			clientId: appointment.clientId.toString(),
			paymentId: appointment.paymentId.toString(),
			serviceId: appointment.serviceId.toString(),
			startDate: appointment.startDate,
			endDate: appointment.endDate,
			status: appointment.status,
			price: Prisma.Decimal(appointment.price),
		};
	}
}
