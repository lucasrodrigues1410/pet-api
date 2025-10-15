import {
	Prisma,
	Appointment as PrismaAppointment,
} from "prisma/generated/client";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";

export class PrismaAppointmentMapper {
	static toDomain(prismaAppointment: PrismaAppointment): Appointment {
		return Appointment.create(
			{
				animalId: new UniqueEntityID(prismaAppointment.animalId),
				serviceId: new UniqueEntityID(prismaAppointment.serviceId),
				staffId: new UniqueEntityID(prismaAppointment.staffId),
				clientId: new UniqueEntityID(prismaAppointment.clientId),
				companyId: new UniqueEntityID(prismaAppointment.companyId),
				startDate: prismaAppointment.startDate,
				endDate: prismaAppointment.endDate,
				price: prismaAppointment.price,
				status: prismaAppointment.status,
				coatType: prismaAppointment.coatType,
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
			clientId: appointment.clientId.toString(),
			companyId: appointment.companyId.toString(),
			startDate: appointment.startDate,
			endDate: appointment.endDate,
			status: appointment.status,
			price: appointment.price,
			staffId: appointment.staffId.toString(),
			coatType: appointment.coatType,
		};
	}

	static toPersistenceUpdate(
		appointment: Partial<Appointment>,
	): Prisma.AppointmentUncheckedUpdateInput {
		return { status: appointment.status };
	}
}
