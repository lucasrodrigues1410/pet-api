import { Asset } from "@/modules/asset/domain/entities/asset";
import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { Location } from "@/modules/location/domain/entities/location";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Company } from "../entities/company.entity";

type FindCompanyResult = Company & {
	availabilities: CompanyAvailability[];
	images: Asset[];
	services: Service[];
	address: Location;
};

type SearchCompanyResult = Company & { address: Location; image: Asset };

export abstract class CompanyRepository {
	abstract findById(id: string): Promise<FindCompanyResult | null>;
	abstract searchCompanies(
		params: {
			search?: string;
			location?: string;
			categories?: string[];
		} & PaginationQuery,
	): Promise<PaginationResult<SearchCompanyResult>>;
	abstract update(id: string, data: Partial<Company>): Promise<void>;
}
