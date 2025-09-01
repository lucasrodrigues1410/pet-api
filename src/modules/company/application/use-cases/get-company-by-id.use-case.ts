import { Injectable } from "@nestjs/common";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { Location } from "@/modules/location/domain/entities/location";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";

interface GetCompanyByIdUseCaseRequest {
	id: string;
}

type GetCompanyByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		company: Company & {
			availabilities: CompanyAvailability[];
			images: Asset[];
			services: Service[];
			address: Location;
		};
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
