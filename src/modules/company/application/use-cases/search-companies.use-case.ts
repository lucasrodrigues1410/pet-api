import { Injectable } from "@nestjs/common";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Location } from "@/modules/location/domain/entities/location";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";

type SearchCompaniesUseCaseRequest = {
	search?: string;
	location?: string;
	categories?: string[];
} & PaginationQuery;

type SearchCompaniesUseCaseResponse = Either<
	null,
	{ companies: PaginationResult<Company & { address: Location; image: Asset }> }
>;

@Injectable()
export class SearchCompaniesUseCase {
	constructor(private companyRepository: CompanyRepository) {}

	async execute(
		query: SearchCompaniesUseCaseRequest,
	): Promise<SearchCompaniesUseCaseResponse> {
		const companies = await this.companyRepository.searchCompanies(query);
		return right({ companies });
	}
}
