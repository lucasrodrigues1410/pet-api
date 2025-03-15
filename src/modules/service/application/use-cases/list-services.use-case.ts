import { Injectable } from "@nestjs/common";
import { Either, right } from "src/core/either";
import { Service } from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";

type ListServicesUseCaseResponse = Either<
	null,
	{
		services: Service[];
	}
>;

@Injectable()
export class ListServicesUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute(): Promise<ListServicesUseCaseResponse> {
		const result = await this.serviceRepository.findAll();
		return right({
			services: result,
		});
	}
}
