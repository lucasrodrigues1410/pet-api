import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityPresenter } from "./company-availability.presenter";

export class CompanyAvailabilityListPresenter {
	static present(availabilities: CompanyAvailability[]) {
		return {
			items: availabilities.map((availability) =>
				CompanyAvailabilityPresenter.present(availability),
			),
		};
	}
}
