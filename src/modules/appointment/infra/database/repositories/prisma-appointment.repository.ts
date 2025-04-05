import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { Injectable } from "@nestjs/common";
import { PrismaAppointmentMapper } from "../mapper/prisma-appointment.mapper";

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
	constructor(private prismaService: PrismaService) {}

	async create(appointment: Appointment) {
		const persistence = PrismaAppointmentMapper.toPersistence(appointment);
		await this.prismaService.appointment.create({
			data: persistence,
		});
	}

	async getByPeriod(params: {
		serviceId: string;
		startDate: Date;
		endDate: Date;
	}) {
		const { serviceId, startDate, endDate } = params;

		const appointments = await this.prismaService.appointment.findMany({
			where: {
				serviceId,
				startDate: {
					gte: startDate,
				},
				endDate: {
					lte: endDate,
				},
			},
		});

		return appointments.map(PrismaAppointmentMapper.toDomain);
	}
}
