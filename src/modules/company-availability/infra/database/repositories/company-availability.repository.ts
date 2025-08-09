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

    async upsertByCompanyAndDay(availability: Parameters<PrismaCompanyAvailabilityMapper["toPrisma"]>[0]) {
        const data = PrismaCompanyAvailabilityMapper.toPrisma(availability);
        const existing = await this.prismaService.companyAvailability.findFirst({
            where: { companyId: data.companyId, day: data.day },
        });
        let saved;
        if (existing) {
            saved = await this.prismaService.companyAvailability.update({
                where: { id: existing.id },
                data: {
                    startTime: data.startTime,
                    endTime: data.endTime,
                    lunchStartTime: data.lunchStartTime,
                    lunchEndTime: data.lunchEndTime,
                },
            });
        } else {
            saved = await this.prismaService.companyAvailability.create({
                data,
            });
        }
        return PrismaCompanyAvailabilityMapper.toDomain(saved);
    }

    async deleteByCompanyAndDay(companyId: string, dayOfWeek: DaysOfWeek) {
        await this.prismaService.companyAvailability.deleteMany({
            where: { companyId, day: dayOfWeek },
        });
    }
}
