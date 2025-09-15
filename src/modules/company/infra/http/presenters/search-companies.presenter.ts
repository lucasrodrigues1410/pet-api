import { Asset } from "@/modules/asset/domain/entities/asset";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { Location } from "@/modules/location/domain/entities/location";
import { PaginationResult } from "@/shared/utils/pagination";
import { CompanyPresenter } from "./company.presenter";

type CompanyWithRelations = Company & { address: Location; image?: Asset };

export class SearchCompaniesPresenter {
	static present(result: PaginationResult<CompanyWithRelations>) {
		return {
			items: result.items.map((company) =>
				CompanyPresenter.presentWithAddressAndImage(
					company,
					company.address,
					company.image,
				),
			),
			meta: result.meta,
		};
	}
}
