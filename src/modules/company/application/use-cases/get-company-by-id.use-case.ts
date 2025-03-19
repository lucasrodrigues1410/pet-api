import { Injectable } from "@nestjs/common";
import { Either, left, right } from "src/core/either";
import { ResourceNotFoundError } from "src/core/errors/errors/resource-not-found.error";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";

interface GetCompanyByIdUseCaseRequest {
	id: string;
}

type GetCompanyByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		company: Company;
	}
>;

@Injectable()
export class GetCompanyByIdUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute({
		id,
	}: GetCompanyByIdUseCaseRequest): Promise<GetCompanyByIdUseCaseResponse> {
		const company = await this.companyRepository.findById(id);

		if (!company) {
			return left(new ResourceNotFoundError());
		}

		return right({
			company,
		});
	}
}
