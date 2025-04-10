import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { PaginationParams } from "@/core/pagination/pagination-params";
import { PaginationResult } from "@/core/pagination/pagination-result";

type SearchCompaniesUseCaseRequest = {
	location?: {
		latitude: number;
		longitude: number;
	};
	query?: string;
} & PaginationParams

type SearchCompaniesUseCaseResponse = Either<
	null,
	PaginationResult<Company>
>;

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
