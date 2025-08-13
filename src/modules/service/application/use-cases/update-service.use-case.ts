import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PriceRange } from "../../domain/entities/value-objects/price-range.value-object";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface UpdateServiceUseCaseRequest {
	id: string;
	companyId: string;
	name?: string;
	description?: string;
	price?: number;
	duration?: number;
	details?: Record<string, unknown>;
	priceRange?: {
		min: number;
		max: number;
	};
}

type UpdateServiceUseCaseResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class UpdateServiceUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute({
		id,
		companyId,
		...data
	}: UpdateServiceUseCaseRequest): Promise<UpdateServiceUseCaseResponse> {
		const existingService = await this.serviceRepository.findById(id);

		if (existingService?.companyId.toString() !== companyId) {
			return left(new ResourceNotFoundError());
		}

		const priceRange = data.priceRange
			? PriceRange.create(data.priceRange)
			: undefined;

		existingService.update({
			...data,
			priceRange,
		});

		await this.serviceRepository.update(id, existingService);
		return right(undefined);
	}
}
