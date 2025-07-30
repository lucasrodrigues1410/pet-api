import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { DaysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { PrismaCompanyAvailabilityMapper } from "../mappers/company-availability.mapper";

@Injectable()
export class PrismaCompanyAvailabilityRepository
	implements CompanyAvailabilityRepository
{
	constructor(private readonly prismaService: PrismaService) {}

	async findAllByCompanyId(companyId: string) {
		const companyAvailability =
			await this.prismaService.companyAvailability.findMany({
				where: {
					companyId: companyId,
				},
			});

		return companyAvailability.map((availability) =>
			PrismaCompanyAvailabilityMapper.toDomain(availability),
		);
	}

	async findByCompanyIdAndDayOfWeek(companyId: string, dayOfWeek: DaysOfWeek) {
		const companyAvailability =
			await this.prismaService.companyAvailability.findFirst({
				where: {
					companyId: companyId,
					day: dayOfWeek,
				},
			});

		if (!companyAvailability) {
			return null;
		}

		return PrismaCompanyAvailabilityMapper.toDomain(companyAvailability);
	}
}
