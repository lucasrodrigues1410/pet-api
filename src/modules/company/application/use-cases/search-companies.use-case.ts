import { Injectable } from "@nestjs/common";
import { Either, right } from "src/core/either";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { Company } from "../../domain/entities/company.entity";

interface SearchCompaniesUseCaseRequest {
	location?: {
		latitude: number;
		longitude: number;
	};
	query?: string;
	page?: number;
}


type SearchCompaniesUseCaseResponse = Either<
	null,
	{
		companies: Company[];
	}
>;

@Injectable()
export class SearchCompaniesUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute(params:SearchCompaniesUseCaseRequest): Promise<SearchCompaniesUseCaseResponse> {
		const companies = await this.companyRepository.searchCompanies(params);
		return right({
			companies,
		});
	}
}
