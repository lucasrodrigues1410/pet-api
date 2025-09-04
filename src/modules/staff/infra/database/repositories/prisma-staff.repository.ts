import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Staff, StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { PrismaUserMapper } from "@/modules/user/infra/database/mappers/prisma-user.mapper";
import { DateRange } from "@/shared/types/date-range";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";
import { PrismaStaffMapper } from "../mappers/prisma-staff.mapper";

@Injectable()
export class PrismaStaffRepository implements StaffRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findById(id: string) {
		const staff = await this.prismaService.userCompany.findUnique({
			where: { id },
		});

		if (!staff) {
			return null;
		}

		return PrismaStaffMapper.toDomain(staff);
	}

	async findByUserId(userId: string) {
		const staff = await this.prismaService.userCompany.findFirst({
			where: { userId: userId },
		});

		if (!staff) {
			return null;
		}

		return PrismaStaffMapper.toDomain(staff);
	}

	async findByCompanyId(
		companyId: string,
		query: PaginationQuery & {
			query?: string;
			roles?: StaffRole[];
		},
	) {
		const where: Prisma.UserCompanyWhereInput = {
			companyId: companyId,
			OR: [
				{ user: { name: { contains: query.query, mode: "insensitive" } } },
				{ user: { email: { contains: query.query, mode: "insensitive" } } },
			],
			role: { in: query.roles },
		};

		const staff = await paginate(
			async ({ skip, take }) =>
				this.prismaService.userCompany.findMany({
					where,
					include: {
						user: true,
					},
					skip,
					take,
				}),
			() =>
				this.prismaService.userCompany.count({
					where,
				}),
			query,
		);

		return {
			items: staff.items.map((st) =>
				Object.assign(PrismaStaffMapper.toDomain(st), {
					user: PrismaUserMapper.toDomain(st.user),
				}),
			),
			meta: staff.meta,
		};
	}

	async findAvailableForSlot(companyId: string, range: DateRange) {
		const staff = await this.prismaService.userCompany.findMany({
			where: {
				companyId: companyId,
				AND: {
					appointment: {
						none: {
							OR: [
								{
									startDate: { gte: range.startDate },
									endDate: { lte: range.endDate },
								},
							],
						},
					},
					company: {
						companyAvailabilityException: {
							none: {
								OR: [
									{
										startDate: { gte: range.startDate },
										endDate: { lte: range.endDate },
									},
								],
							},
						},
					},
				},
			},
		});

		if (!staff) {
			return [];
		}

		return staff.map(PrismaStaffMapper.toDomain);
	}

	async fetchCompanyStaffWithAppointmentsInDateRange(
		companyId: string,
		range: DateRange,
	) {
		const staff = await this.prismaService.userCompany.findMany({
			where: {
				companyId: companyId,
			},
			include: {
				appointment: {
					where: {
						startDate: { gte: range.startDate },
						endDate: { lte: range.endDate },
					},
				},
			},
		});

		return staff.map(PrismaStaffMapper.toDomain);
	}

	async create(staff: Staff) {
		const staffData = PrismaStaffMapper.toPersistence(staff);

		await this.prismaService.userCompany.create({
			data: staffData,
		});
	}

	async delete(id: string) {
		await this.prismaService.userCompany.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}
}
