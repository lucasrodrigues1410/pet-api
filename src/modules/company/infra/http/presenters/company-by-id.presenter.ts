import { Asset } from "@/modules/asset/domain/entities/asset";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { Location } from "@/modules/location/domain/entities/location";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { CompanyPresenter } from "./company.presenter";

type CompanyWithRelations = Company & {
	availabilities: CompanyAvailability[];
	images: Asset[];
	services: Service[];
	address: Location;
};

export class CompanyByIdPresenter {
	static present(company: CompanyWithRelations) {
		return CompanyPresenter.presentComplete(
			company,
			company.address,
			company.images,
			company.services,
			company.availabilities,
		);
	}
}
