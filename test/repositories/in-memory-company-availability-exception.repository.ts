import { CompanyAvailabilityException } from "@/modules/company-availability/domain/entities/company-availability-exception.entity";
import { CompanyAvailabilityExcpetionRepository } from "@/modules/company-availability/domain/repositories/company-availability-exception.repository";

export class InMemoryCompanyAvailabilityExceptionRepository
	implements CompanyAvailabilityExcpetionRepository
{
	public items: CompanyAvailabilityException[] = [];

	findExceptionsByCompanyAndPeriod(
		companyId: string,
		period: {
			startDate: Date;
			endDate: Date;
		},
	): Promise<CompanyAvailabilityException[]> {
		const companyAvailabilityExceptions = this.items.filter(
			(availability) =>
				availability.companyId === companyId &&
				availability.startDate >= period.startDate &&
				availability.endDate <= period.endDate,
		);

		return Promise.resolve(companyAvailabilityExceptions);
	}
}
