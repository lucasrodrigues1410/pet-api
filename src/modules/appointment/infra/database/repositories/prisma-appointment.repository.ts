import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { PrismaAnimalMapper } from "@/modules/animal/infra/database/mappers/prisma-animal.mapper";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { PrismaCompanyMapper } from "@/modules/company/infra/database/mappers/prisma-company.mapper";
import { PrismaServiceMapper } from "@/modules/service/infra/database/mappers/prisma-service.mapper";
import { PrismaUserMapper } from "@/modules/user/infra/database/mappers/prisma-user.mapper";
import type { DateRange } from "@/shared/types/date-range";
import { paginate } from "@/shared/utils/paginator";
import { PrismaAppointmentMapper } from "../mapper/prisma-appointment.mapper";

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
	constructor(private prismaService: PrismaService) {}

	async findById(id: string) {
		const appointment = await this.prismaService.appointment.findUnique({
			where: { id },
			include: {
				animal: true,
				client: true,
				service: true,
				company: true,
			},
		});
		if (!appointment) {
			return null;
		}

		return {
			...PrismaAppointmentMapper.toDomain(appointment),
			animal: PrismaAnimalMapper.toDomain(appointment.animal),
			client: PrismaUserMapper.toDomain(appointment.client),
			service: PrismaServiceMapper.toDomain(appointment.service),
			company: PrismaCompanyMapper.toDomain(appointment.company),
		} as Awaited<ReturnType<AppointmentRepository["findById"]>>;
	}

	async findByUserId(
		params: Parameters<AppointmentRepository["findByUserId"]>[0],
	) {
		const filter = {
			clientId: params.userId,
		} as Prisma.AppointmentWhereInput;

		const appointments = await paginate(
			({ skip, take }) =>
				this.prismaService.appointment.findMany({
					skip,
					take,
					orderBy: { createdAt: "desc" },
					where: filter,
				}),
			() =>
				this.prismaService.appointment.count({
					where: filter,
				}),
			params.query,
		);
		return {
			...appointments,
			items: appointments.items.map(PrismaAppointmentMapper.toDomain),
		};
	}

	async findByCompanyId(
		params: Parameters<AppointmentRepository["findByCompanyId"]>[0],
	) {
		const filter = {
			companyId: params.companyId,
		} as Prisma.AppointmentWhereInput;

		const appointments = await paginate(
			({ skip, take }) =>
				this.prismaService.appointment.findMany({
					skip,
					take,
					orderBy: { createdAt: "desc" },
					where: filter,
				}),
			() =>
				this.prismaService.appointment.count({
					where: filter,
				}),
			params.query,
		);
		return {
			...appointments,
			items: appointments.items.map(PrismaAppointmentMapper.toDomain),
		};
	}

	async create(appointment: Appointment) {
		const persistence = PrismaAppointmentMapper.toPersistence(appointment);
		await this.prismaService.appointment.create({
			data: persistence,
		});
	}

	async getByPeriod(params: { serviceId: string; range: DateRange }) {
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

	async update(appointment: Appointment) {
		const persistence = PrismaAppointmentMapper.toPersistence(appointment);
		await this.prismaService.appointment.update({
			where: { id: persistence.id },
			data: persistence,
		});
	}
}
