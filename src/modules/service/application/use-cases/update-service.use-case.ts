import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Service } from "../../domain/entities/service.entity";
import { PriceRange } from "../../domain/entities/value-objects/price-range.value-object";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface UpdateServiceUseCaseRequest {
	id: string;
	companyId: string;
	name?: string;
	description?: string;
	price?: number;
	isActive?: boolean;
	duration?: number;
	details?: Record<string, unknown>;
	priceRange?: {
		min: number;
		max: number;
	};
}

type UpdateServiceUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		service: Service;
	}
>;

@Injectable()
export class UpdateServiceUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute({
		id,
		companyId,
		name,
		description,
		price,
		isActive,
		duration,
		details,
		priceRange,
	}: UpdateServiceUseCaseRequest): Promise<UpdateServiceUseCaseResponse> {
		const existingService = await this.serviceRepository.findById(id);

		if (!existingService || existingService.companyId.toString() !== companyId) {
			return left(new ResourceNotFoundError());
		}

		const updatedService = Service.create(
			{
				name: name ?? existingService.name,
				description: description ?? existingService.description,
				price: price ?? existingService.price,
				isActive: isActive ?? existingService.isActive,
				duration: duration ?? existingService.duration,
				companyId: existingService.companyId,
				details: details ?? existingService.details,
				priceRange: priceRange
					? PriceRange.create(priceRange)
					: existingService.priceRange,
			},
			existingService.id,
		);

		await this.serviceRepository.update(updatedService);

		return right({
			service: updatedService,
		});
	}
}
