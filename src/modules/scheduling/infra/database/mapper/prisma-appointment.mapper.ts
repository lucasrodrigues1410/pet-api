import { Appointment } from "@/modules/scheduling/domain/entities/appointment.entity";
import { Prisma, Appointment as PrismaAppointment } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class PrismaAppointementMapper {
	static toDomain(prismaAppointment: PrismaAppointment): Appointment {
		return Appointment.create(
			{
				animalId: prismaAppointment.animalId,
				paymentId: new UniqueEntityID(prismaAppointment.paymentId),
				clientId: prismaAppointment.clientId,
				companyId: prismaAppointment.companyId,
				startDate: prismaAppointment.startDate,
				endDate: prismaAppointment.endDate,
				serviceId: prismaAppointment.serviceId,
				status: prismaAppointment.status,
				notes: prismaAppointment.notes ?? undefined,
				priceAtScheduling: prismaAppointment.priceAtScheduling
					? Number(prismaAppointment.priceAtScheduling)
					: undefined,
			},
			new UniqueEntityID(prismaAppointment.id),
		);
	}

	static toPrisma(
		appointment: Appointment,
	): Prisma.AppointmentUncheckedCreateInput {
		return {
			animalId: appointment.animalId,
			clientId: appointment.clientId,
			paymentId: appointment.paymentId.toString(),
			companyId: appointment.companyId,
			serviceId: appointment.serviceId,
			startDate: appointment.startDate,
			endDate: appointment.endDate,
			status: appointment.status,
			notes: appointment.notes ?? undefined,
			priceAtScheduling: appointment.priceAtScheduling
				? String(appointment.priceAtScheduling)
				: undefined,
		};
	}
}
