import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface DeactivateServiceUseCaseRequest {
	id: string;
	companyId: string;
}

type DeactivateServiceUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeactivateServiceUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute({
		id,
		companyId,
	}: DeactivateServiceUseCaseRequest): Promise<DeactivateServiceUseCaseResponse> {
		const existingService = await this.serviceRepository.findById(id);

		if (
			!existingService ||
			existingService.companyId.toString() !== companyId
		) {
			return left(new ResourceNotFoundError());
		}

		await this.serviceRepository.update(id, {
			isActive: false,
		});

		return right(null);
	}
}
