import type { DateRange } from "@/shared/types/date-range";
import { CompanyAvailabilityException } from "../entities/company-availability-exception.entity";

export abstract class CompanyAvailabilityExcpetionRepository {
	abstract findExceptionsByCompanyAndPeriod(
		companyId: string,
		period: DateRange,
	): Promise<CompanyAvailabilityException[] | null>;
}
