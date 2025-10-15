import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { PrismaAnimalMapper } from "@/modules/animal/infra/database/mappers/prisma-animal.mapper";
import {
	Appointment,
	AppointmentStatus,
} from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";
import { PrismaBreedMapper } from "@/modules/breed/infra/database/mappers/prisma-breed.mapper";
import { PrismaCompanyMapper } from "@/modules/company/infra/database/mappers/prisma-company.mapper";
import { PrismaServiceMapper } from "@/modules/service/infra/database/mappers/prisma-service.mapper";
import { PrismaUserMapper } from "@/modules/user/infra/database/mappers/prisma-user.mapper";
import type { DateRange } from "@/shared/types/date-range";
import { paginate } from "@/shared/utils/paginator";
import { PrismaAppointmentMapper } from "../mapper/prisma-appointment.mapper";

const appointmentDefaultInclude = {
	animal: { include: { breed: true, asset: true } },
	client: { include: { avatar: true } },
	service: true,
	company: { include: { logo: true } },
} satisfies Prisma.AppointmentInclude;

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
	constructor(private prismaService: PrismaService) {}

	async findById(id: string) {
		const appointment = await this.prismaService.appointment.findUnique({
			where: { id },
			include: {
				...appointmentDefaultInclude,
				company: { include: { logo: true } },
			},
		});
		if (!appointment) return null;
		return Object.assign(PrismaAppointmentMapper.toDomain(appointment), {
			animal: Object.assign(PrismaAnimalMapper.toDomain(appointment.animal), {
				breed: PrismaBreedMapper.toDomain(appointment.animal.breed),
				asset: appointment.animal.asset
					? PrismaAssetMapper.toDomain(appointment.animal.asset)
					: undefined,
			}),
			client: PrismaUserMapper.toDomain(appointment.client),
			service: PrismaServiceMapper.toDomain(appointment.service),
			company: PrismaCompanyMapper.toDomain(appointment.company),
		});
	}

	async findByUserId(
		params: Parameters<AppointmentRepository["findByUserId"]>[0],
	) {
		const filter = {
			clientId: params.userId,
			...(params.query.startDate && {
				startDate: { gte: params.query.startDate },
			}),
			...(params.query.endDate && { endDate: { lte: params.query.endDate } }),
			...(params.query.status && { status: { in: params.query.status } }),
		} as Prisma.AppointmentWhereInput;

		const appointments = await paginate(
			({ skip, take }) =>
				this.prismaService.appointment.findMany({
					skip,
					take,
					orderBy: { createdAt: "desc" },
					where: filter,
					include: appointmentDefaultInclude,
				}),
			() => this.prismaService.appointment.count({ where: filter }),
			params.query,
		);
		return {
			...appointments,
			items: appointments.items.map((appointment) =>
				Object.assign(PrismaAppointmentMapper.toDomain(appointment), {
					animal: PrismaAnimalMapper.toDomain(appointment.animal),
					service: PrismaServiceMapper.toDomain(appointment.service),
					company: PrismaCompanyMapper.toDomain(appointment.company),
				}),
			),
		};
	}

	async findByCompanyId(
		params: Parameters<AppointmentRepository["findByCompanyId"]>[0],
	) {
		const filter = {
			companyId: params.companyId,
			OR: [
				{
					client: {
						name: { contains: params.query.query, mode: "insensitive" },
					},
				},
				{
					service: {
						name: { contains: params.query.query, mode: "insensitive" },
					},
				},
				{
					animal: {
						name: { contains: params.query.query, mode: "insensitive" },
					},
				},
			],
			startDate: { gte: params.query.startDate },
			endDate: { lte: params.query.endDate },
			status: { in: params.query.status },
		} as Prisma.AppointmentWhereInput;

		const { items, meta } = await paginate(
			({ skip, take }) =>
				this.prismaService.appointment.findMany({
					skip,
					take,
					orderBy: { createdAt: "desc" },
					where: filter,
					include: appointmentDefaultInclude,
				}),
			() => this.prismaService.appointment.count({ where: filter }),
			params.query,
		);
		return {
			meta,
			items: items.map((appointment) =>
				Object.assign(PrismaAppointmentMapper.toDomain(appointment), {
					animal: Object.assign(
						PrismaAnimalMapper.toDomain(appointment.animal),
						{ breed: PrismaBreedMapper.toDomain(appointment.animal.breed) },
					),
					client: PrismaUserMapper.toDomain(appointment.client),
					service: PrismaServiceMapper.toDomain(appointment.service),
				}),
			),
		};
	}

	async create(appointment: Appointment) {
		const persistence = PrismaAppointmentMapper.toPersistence(appointment);
		await this.prismaService.appointment.create({ data: persistence });
	}

	async getByPeriod(params: { serviceId: string; range: DateRange }) {
		const {
			serviceId,
			range: { startDate: start, endDate: end },
		} = params;

		const appointments = await this.prismaService.appointment.findMany({
			where: { serviceId, startDate: { gte: start }, endDate: { lte: end } },
		});

		return appointments.map(PrismaAppointmentMapper.toDomain);
	}

	async updateStatus(id: string, status: AppointmentStatus) {
		await this.prismaService.appointment.update({
			where: { id },
			data: { status },
		});
	}

	async getByPeriodAndCompanyId(params: {
		companyId: string;
		range: DateRange;
	}) {
		const {
			companyId,
			range: { startDate: start, endDate: end },
		} = params;
		const appointments = await this.prismaService.appointment.findMany({
			where: { companyId, startDate: { gte: start }, endDate: { lte: end } },
		});
		return appointments.map(PrismaAppointmentMapper.toDomain);
	}

	async userHasCompletedAppointmentForCompany(params: {
		userId: string;
		companyId: string;
	}) {
		const appointment = await this.prismaService.appointment.findFirst({
			where: {
				clientId: params.userId,
				companyId: params.companyId,
				status: "completed",
			},
			select: { id: true },
		});

		return Boolean(appointment);
	}
}
