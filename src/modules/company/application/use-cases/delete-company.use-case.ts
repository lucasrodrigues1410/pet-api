import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { CompanyRepository } from "../../domain/repositories/company.repository";

interface DeleteCompanyUseCaseRequest {
	companyId: string;
}

type DeleteCompanyUseCaseResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class DeleteCompanyUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute(
		data: DeleteCompanyUseCaseRequest,
	): Promise<DeleteCompanyUseCaseResponse> {
		const company = await this.companyRepository.findById(data.companyId);
		if (!company) {
			return left(new ResourceNotFoundError("Empresa não encontrada"));
		}

		await this.companyRepository.softDelete(data.companyId);
		return right(undefined);
	}
}
