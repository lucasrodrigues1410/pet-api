import { Injectable } from "@nestjs/common";
import { Either, right } from "src/core/either";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { Company } from "../../domain/entities/company.entity";

type ListOpenCompaniesUseCaseResponse = Either<
	null,
	{
		companies: Company[];
	}
>;

@Injectable()
export class ListOpenCompaniesUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute(): Promise<ListOpenCompaniesUseCaseResponse> {
		const companies = await this.companyRepository.findAllOpenCompanies();
		return right({
			companies,
		});
	}
}
