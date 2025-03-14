import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";
import { CompanyPrismaMapper } from "../mappers/company.mapper";
import { getDayOfWeek } from "src/core/enums/day-of-week.enum";

@Injectable()
export class CompanyPrismaRepository implements CompanyRepository {
	constructor(private prismaService: PrismaService) {}

	async findAllOpenCompanies(): Promise<Company[]> {
		const now = new Date();

		const result = await this.prismaService.company.findMany({
			where: {
				companyAvailability: {
					some: {
						day: {
							equals: getDayOfWeek(now),
						},
						startTime: {
							lte: now,
						},
						endTime: {
							gte: now,
						},
					},
				},
				companyAvailabilityException: {
					none: {
						startDate: {
							lte: now,
						},
						endDate: {
							gte: now,
						},
					},
				},
			},
		});
		return result.map((company) => CompanyPrismaMapper.toDomain(company));
	}
}
