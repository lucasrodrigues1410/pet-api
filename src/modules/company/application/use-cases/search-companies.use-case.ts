import { Injectable } from "@nestjs/common";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Location } from "@/modules/location/domain/entities/location";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";

interface SearchCompaniesUseCaseRequest {
	query?: string;
	location?: { latitude: number; longitude: number; radiusInKm?: number };
	pagination: PaginationQuery;
}

type SearchCompaniesUseCaseResponse = Either<
	null,
	{ companies: PaginationResult<Company & { address: Location; image: Asset }> }
>;

@Injectable()
export class SearchCompaniesUseCase {
	constructor(private companyRepository: CompanyRepository) {}

	async execute({
		query,
		location,
		pagination,
	}: SearchCompaniesUseCaseRequest): Promise<SearchCompaniesUseCaseResponse> {
		const companies = await this.companyRepository.searchCompanies({
			query,
			location,
			...pagination,
		});

		return right({ companies });
	}
}
