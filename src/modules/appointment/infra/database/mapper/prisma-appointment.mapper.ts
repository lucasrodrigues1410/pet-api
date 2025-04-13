import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Appointment, CoatType } from "@/modules/appointment/domain/entities/appointment.entity";
import { Prisma, Appointment as PrismaAppointment } from "@prisma/client";

export class PrismaAppointmentMapper {
	static toDomain(prismaAppointment: PrismaAppointment): Appointment {
		return Appointment.create(
			{
				animalId: new UniqueEntityID(prismaAppointment.animalId),
				serviceId: new UniqueEntityID(prismaAppointment.serviceId),
				staffId: new UniqueEntityID(prismaAppointment.staffId),
				startDate: prismaAppointment.startDate,
				endDate: prismaAppointment.endDate,
				price: prismaAppointment.price.toNumber(),
				status: prismaAppointment.status,
				coatType: prismaAppointment.coatType as CoatType,
			},
			new UniqueEntityID(prismaAppointment.id),
		);
	}

	static toPersistence(
		appointment: Appointment,
	): Prisma.AppointmentUncheckedCreateInput {
		return {
			id: appointment.id.toString(),
			animalId: appointment.animalId.toString(),
			serviceId: appointment.serviceId.toString(),
			startDate: appointment.startDate,
			endDate: appointment.endDate,
			status: appointment.status,
			price: Prisma.Decimal(appointment.price),
			staffId: appointment.staffId.toString(),
			coatType: appointment.coatType,
		};
	}
}
