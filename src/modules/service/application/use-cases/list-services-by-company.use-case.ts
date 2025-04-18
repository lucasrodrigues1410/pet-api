import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Service } from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface ListServicesByCompanyUseCaseRequest {
	companyId: string;
}

type ListActiveServicesUseCaseResponse = Either<
	null,
	{
		services: Service[];
	}
>;

@Injectable()
export class ListServicesByCompanyUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute({
		companyId,
	}: ListServicesByCompanyUseCaseRequest): Promise<ListActiveServicesUseCaseResponse> {
		const services = await this.serviceRepository.findByCompanyId(companyId);

		return right({ services });
	}
}
