import { CompanyAvailabilityException } from "../entities/company-availability-exception.entity";

export abstract class CompanyAvailabilityExcpetionRepository {
	abstract findExceptionsByCompanyAndPeriod(
		companyId: string,
		period: {
			startDate: Date;
			endDate: Date;
		},
	): Promise<CompanyAvailabilityException[] | null>;
}
