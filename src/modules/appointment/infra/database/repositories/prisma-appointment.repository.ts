import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import type { DateRange } from "@/shared/types/date-range";
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
		range: DateRange;
	}) {
		const {
			serviceId,
			range: { startDate: start, endDate: end },
		} = params;

		const appointments = await this.prismaService.appointment.findMany({
			where: {
				serviceId,
				startDate: {
					gte: start,
				},
				endDate: {
					lte: end,
				},
			},
		});

		return appointments.map(PrismaAppointmentMapper.toDomain);
	}
}
