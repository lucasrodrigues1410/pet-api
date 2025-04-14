import { PaginationParams } from "@/core/pagination/pagination-params";
import { PaginationResult } from "@/core/pagination/pagination-result";
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
		} & PaginationParams,
	): Promise<PaginationResult<Company>>;
	abstract create(company: Company): Promise<void>;
}
