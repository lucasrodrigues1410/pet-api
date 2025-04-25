import { PaginationQuery } from "@/shared/utils/pagination-query";
import { PaginationResult } from "@/shared/utils/pagination";
import { Company } from "../entities/company.entity";

export abstract class CompanyRepository {
	abstract findById(id: string): Promise<Company | null>;
	abstract searchCompanies(
		params: {
			location?: {
				latitude: number;
				longitude: number;
			};
			query?: string;
		} & PaginationQuery,
	): Promise<PaginationResult<Company>>;
	abstract create(company: Company): Promise<void>;
}
