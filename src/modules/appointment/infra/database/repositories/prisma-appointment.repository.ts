import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { PrismaAppointementMapper } from "../mapper/prisma-appointment.mapper";

export class PrismaAppointmentRepository implements AppointmentRepository {
	constructor(private prismaService: PrismaService) {}

	async create(appointment: Appointment) {
		const persistence = PrismaAppointementMapper.toPrisma(appointment);
		await this.prismaService.appointment.create({
			data: persistence,
		});
	}

    async getAppointmentsByPeriod(params: {
        companyId: string;
        startDate: Date;
        endDate: Date;
    }) {
        const { companyId, startDate, endDate } = params;

        const appointments = await this.prismaService.appointment.findMany({
            where: {
                companyId,
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
