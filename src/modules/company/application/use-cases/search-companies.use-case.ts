import { PaginationQuery } from "@/core/infra/dtos/pagination-query.dto";
import { PaginationResult } from "@/core/infra/dtos/pagination.dto";
import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";

type SearchCompaniesUseCaseRequest = {
	location?: {
		latitude: number;
		longitude: number;
	};
	query?: string;
} & PaginationQuery;

type SearchCompaniesUseCaseResponse = Either<null, PaginationResult<Company>>;

@Injectable()
export class SearchCompaniesUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute(
		params: SearchCompaniesUseCaseRequest,
	): Promise<SearchCompaniesUseCaseResponse> {
		const response = await this.companyRepository.searchCompanies(params);
		return right(response);
	}
}
