import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { CompanyAvailabilityExcpetionRepository } from "@/modules/company-availability/domain/repositories/company-availability-exception.repository";
import type { DateRange } from "@/shared/types/date-range";
import { PrismaCompanyAvailabilityExceptionMapper } from "../mappers/company-availability-exception.mapper";

@Injectable()
export class PrismaCompanyAvailabilityExceptionRepository
	implements CompanyAvailabilityExcpetionRepository
{
	constructor(private readonly prismaService: PrismaService) {}

	async findExceptionsByCompanyAndPeriod(companyId: string, period: DateRange) {
		const companyAvailabilityExc =
			await this.prismaService.companyAvailabilityException.findMany({
				where: {
					companyId: companyId,
					startDate: { gte: period.startDate },
					endDate: { lte: period.endDate },
				},
			});

		return companyAvailabilityExc.map((availability) =>
			PrismaCompanyAvailabilityExceptionMapper.toDomain(availability),
		);
	}
}
