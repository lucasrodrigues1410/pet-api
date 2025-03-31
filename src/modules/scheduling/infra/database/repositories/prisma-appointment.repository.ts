import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Appointment } from "@/modules/scheduling/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/scheduling/domain/repositories/appointment.repository";
import { PrismaAppointementMapper } from "../mapper/prisma-appointment.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
	constructor(private prismaService: PrismaService) {}

	async create(appointment: Appointment) {
		const persistence = PrismaAppointementMapper.toPrisma(appointment);
		await this.prismaService.appointment.create({
			data: persistence,
		});
	}

    async getAppointmentsByPeriod(params: {
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
                }
            },
        });

        return appointments.map(PrismaAppointementMapper.toDomain);
    }
}
