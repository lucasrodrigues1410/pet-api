import {
	CompanyAvailability,
	DaysOfWeek,
} from "../entities/company-availability.entity";

export abstract class CompanyAvailabilityRepository {
	abstract findAllByCompanyId(
		companyId: string,
	): Promise<CompanyAvailability[] | null>;

	abstract findByCompanyIdAndDayOfWeek(
		companyId: string,
		dayOfWeek: DaysOfWeek,
	): Promise<CompanyAvailability | null>;

    abstract upsertByCompanyAndDay(
        availability: CompanyAvailability,
    ): Promise<CompanyAvailability>;

    abstract deleteByCompanyAndDay(
        companyId: string,
        dayOfWeek: DaysOfWeek,
    ): Promise<void>;
}
