import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Staff } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { DateRange } from "@/shared/types/date-range";
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

	async findByCompanyId(companyId: string) {
		const staff = await this.prismaService.userCompany.findMany({
			where: { companyId: companyId },
		});

		if (!staff) {
			return [];
		}

		return staff.map(PrismaStaffMapper.toDomain);
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
}
