import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AppointmentIntentRepository } from "@/modules/appointment/domain/repositories/appointment-intent.repository";
import { AppointmentIntent } from "@/modules/appointment/domain/entities/appointment-intent.entity";
import { PrismaAppointmentIntentMapper } from "../mapper/prisma-appointment-intent.mapper";

@Injectable()
export class PrismaAppointmentIntentRepository
	implements AppointmentIntentRepository
{
	constructor(private prismaService: PrismaService) {}

	async create(appointment: AppointmentIntent) {
		const persistence =
			PrismaAppointmentIntentMapper.toPersistence(appointment);
		await this.prismaService.appointmentIntent.create({
			data: persistence,
		});
	}

	async findValidInRange(params: {
		serviceId: string;
		startDate: Date;
		endDate: Date;
	}) {
		const { serviceId, startDate, endDate } = params;

		const appointments = await this.prismaService.appointmentIntent.findMany({
			where: {
				serviceId,
				startDate: {
					gte: startDate,
				},
				endDate: {
					lte: endDate,
				},
				validUntil: {
					gte: endDate,
				},
			},
		});

		return appointments.map(PrismaAppointmentIntentMapper.toDomain);
	}

	async findById(id: string) {
		const appointment = await this.prismaService.appointmentIntent.findUnique({
			where: {
				id,
			},
		});

		if (!appointment) return null;

		return PrismaAppointmentIntentMapper.toDomain(appointment);
	}
}
