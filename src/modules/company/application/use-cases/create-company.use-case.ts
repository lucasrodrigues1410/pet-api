import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";

interface CreateCompanyUseCaseRequest {
	name: string;
	address?: string;
	contact?: string;
	ownerUserId: string;
}

type CreateCompanyUseCaseResponse = Either<null, { company: Company }>;

@Injectable()
export class CreateCompanyUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute(
		data: CreateCompanyUseCaseRequest,
	): Promise<CreateCompanyUseCaseResponse> {
		const company = Company.create({
			name: data.name,
			address: data.address,
			contact: data.contact,
		});

		await this.companyRepository.create(company, data.ownerUserId);
		return right({ company });
	}
}
