import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface DeleteServiceUseCaseRequest {
	id: string;
	companyId: string;
}

type DeleteServiceUseCaseResponse = Either<
	ResourceNotFoundError,
	null
>;

@Injectable()
export class DeleteServiceUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute({
		id,
		companyId,
	}: DeleteServiceUseCaseRequest): Promise<DeleteServiceUseCaseResponse> {
		const existingService = await this.serviceRepository.findById(id);

		if (!existingService || existingService.companyId.toString() !== companyId) {
			return left(new ResourceNotFoundError());
		}

		await this.serviceRepository.delete(id);

		return right(null);
	}
}
