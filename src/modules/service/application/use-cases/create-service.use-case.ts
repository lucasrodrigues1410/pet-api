import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Either, right } from "@/shared/either";
import { Service } from "../../domain/entities/service.entity";
import { PriceRange } from "../../domain/entities/value-objects/price-range.value-object";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface CreateServiceUseCaseRequest {
	name: string;
	description?: string;
	price: number;
	isActive?: boolean;
	duration?: number;
	companyId: string;
	details?: Record<string, unknown>;
	priceRange?: {
		min: number;
		max: number;
	};
}

type CreateServiceUseCaseResponse = Either<
	null,
	{
		service: Service;
	}
>;

@Injectable()
export class CreateServiceUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute({
		name,
		description,
		price,
		isActive = true,
		duration,
		companyId,
		details = {},
		priceRange,
	}: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
		const service = Service.create({
			name,
			description: description || null,
			price,
			isActive,
			duration: duration || null,
			companyId: new UniqueEntityID(companyId),
			details: details || null,
			priceRange: priceRange
				? PriceRange.create(priceRange)
				: PriceRange.empty(),
		});

		await this.serviceRepository.create(service);

		return right({
			service,
		});
	}
}
