import { Injectable } from "@nestjs/common";
import { Either, right } from "src/core/either";
import { Service } from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";

type ListActiveServicesUseCaseResponse = Either<
	null,
	{
		services: Service[];
	}
>;

@Injectable()
export class ListActiveServicesUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute(): Promise<ListActiveServicesUseCaseResponse> {
		const result = await this.serviceRepository.findAllActive();
		return right({
			services: result,
		});
	}
}
