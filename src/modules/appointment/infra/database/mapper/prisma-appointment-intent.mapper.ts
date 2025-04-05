import { AppointmentIntent } from "@/modules/appointment/domain/entities/appointment-intent.entity";
import {
	Prisma,
	AppointmentIntent as PrismaAppointmentIntent,
} from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class PrismaAppointmentIntentMapper {
	static toDomain(
		prismaAppointment: PrismaAppointmentIntent,
	): AppointmentIntent {
		return AppointmentIntent.create(
			{
				animalId: new UniqueEntityID(prismaAppointment.animalId),
				clientId: new UniqueEntityID(prismaAppointment.clientId),
				serviceId: new UniqueEntityID(prismaAppointment.serviceId),
				validUntil: prismaAppointment.validUntil,
				startDate: prismaAppointment.startDate,
				endDate: prismaAppointment.endDate,
				price: prismaAppointment.price.toNumber(),
				createdAt: prismaAppointment.createdAt,
				updatedAt: prismaAppointment.updatedAt,
			},
			new UniqueEntityID(prismaAppointment.id),
		);
	}

	static toPersistence(
		appointment: AppointmentIntent,
	): Prisma.AppointmentIntentUncheckedCreateInput {
		return {
			animalId: appointment.animalId.toString(),
			clientId: appointment.clientId.toString(),
			serviceId: appointment.serviceId.toString(),
			startDate: appointment.startDate,
			validUntil: appointment.validUntil,
			endDate: appointment.endDate,
			price: Prisma.Decimal(appointment.price),
			createdAt: appointment.createdAt,
			updatedAt: appointment.updatedAt,
		};
	}
}
