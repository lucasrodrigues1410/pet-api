import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import {
	Service,
	ServiceWithRelations,
} from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface GetServiceByIdUseCaseRequest {
	id: string;
}

type GetServiceByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		service: ServiceWithRelations;
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
