import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { TimeRangePresenter } from "./time-range.presenter";

export class CompanyAvailabilityPresenter {
	static present(companyAvailability: CompanyAvailability) {
		return {
			id: companyAvailability.id.toString(),
			companyId: companyAvailability.companyId.toString(),
			day: companyAvailability.day,
			timeRange: TimeRangePresenter.present(companyAvailability.timeRange),
			launchTime: TimeRangePresenter.present(companyAvailability.launchTime),
		};
	}
}
