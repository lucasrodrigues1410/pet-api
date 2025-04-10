import { PaginationParams } from "@/core/pagination/pagination-params";
import { Company } from "../entities/company.entity";
import { PaginationResult } from "@/core/pagination/pagination-result";

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
