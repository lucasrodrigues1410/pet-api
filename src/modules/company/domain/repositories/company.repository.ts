import { PaginationQuery } from "@/core/infra/dtos/pagination-query.dto";
import { Company } from "../entities/company.entity";
import { PaginationResult } from "@/core/infra/dtos/pagination.dto";

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
