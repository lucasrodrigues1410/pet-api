import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Company, CompanyProps } from "../entities/company.entity";

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
	abstract update(
		companyId: string,
		data: Partial<Pick<CompanyProps, "name" | "address" | "contact">>,
	): Promise<Company>;
	abstract softDelete(companyId: string): Promise<void>;
	abstract isOwner(params: {
		companyId: string;
		userId: string;
	}): Promise<boolean>;
}
