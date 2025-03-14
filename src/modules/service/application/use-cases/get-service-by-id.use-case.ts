import { Injectable } from "@nestjs/common";
import { Either, left, right } from "src/core/either";
import { Service } from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { ResourceNotFoundError } from "src/core/errors/errors/resource-not-found.error";

interface GetServiceByIdUseCaseRequest {
	id: number;
}

type GetServiceByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		service: Service;
	}
>;

@Injectable()
export class GetServiceByIdUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute({
		id,
	}: GetServiceByIdUseCaseRequest): Promise<GetServiceByIdUseCaseResponse> {
		const service = await this.serviceRepository.findById(id);

		if (!service) {
			return left(new ResourceNotFoundError());
		}

		return right({
			service,
		});
	}
}
