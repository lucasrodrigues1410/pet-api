import {
	CompanyAvailability,
	DaysOfWeek,
} from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";

export class InMemoryCompanyAvailabilityRepository
	implements CompanyAvailabilityRepository
{
	public items: CompanyAvailability[] = [];

	findAllByCompanyId(companyId: string) {
		const companyAvailability = this.items.filter(
			(availability) => availability.companyId.toString() === companyId,
		);

		if (companyAvailability.length === 0) {
			return Promise.resolve(null);
		}

		return Promise.resolve(companyAvailability);
	}

	async findByCompanyIdAndDayOfWeek(companyId: string, dayOfWeek: DaysOfWeek) {
		const companyAvailability = this.items.find((availability) => {
			return (
				availability.companyId.toString() === companyId &&
				availability.day === dayOfWeek
			);
		});

		if (!companyAvailability) {
			return Promise.resolve(null);
		}
		return Promise.resolve(companyAvailability);
	}
}
