import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";

interface UpdateCompanyUseCaseRequest {
	companyId: string;
	name?: string;
	address?: string;
	contact?: string;
}

type UpdateCompanyUseCaseResponse = Either<
	ResourceNotFoundError,
	{ company: Company }
>;

@Injectable()
export class UpdateCompanyUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute(
		data: UpdateCompanyUseCaseRequest,
	): Promise<UpdateCompanyUseCaseResponse> {
		const company = await this.companyRepository.findById(data.companyId);
		if (!company) {
			return left(new ResourceNotFoundError("Empresa não encontrada"));
		}

		const updated = await this.companyRepository.update(data.companyId, {
			name: data.name ?? company.name,
			address: data.address ?? company.address,
			contact: data.contact ?? company.contact,
		});

		return right({ company: updated });
	}
}
