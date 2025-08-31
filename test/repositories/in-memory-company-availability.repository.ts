import {
	CompanyAvailability,
	type DaysOfWeek,
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

    async upsertByCompanyAndDay(availability: CompanyAvailability) {
        const idx = this.items.findIndex(
            (a) =>
                a.companyId.toString() === availability.companyId.toString() &&
                a.day === availability.day,
        );
        if (idx >= 0) {
            this.items[idx] = availability;
            return availability;
        }
        this.items.push(availability);
        return availability;
    }

    async deleteByCompanyAndDay(companyId: string, dayOfWeek: DaysOfWeek) {
        this.items = this.items.filter(
            (a) => !(a.companyId.toString() === companyId && a.day === dayOfWeek),
        );
    }
}
