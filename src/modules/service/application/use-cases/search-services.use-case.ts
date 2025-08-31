import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { ServiceWithRelations } from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";

type SearchServicesUseCaseRequest = {
	query?: string;
	location?: {
		latitude: number;
		longitude: number;
		radiusInKm?: number;
	};
	priceRange?: {
		min?: number;
		max?: number;
	};
} & PaginationQuery;

type SearchServicesUseCaseResponse = Either<
	null,
	PaginationResult<ServiceWithRelations>
>;

@Injectable()
export class SearchServicesUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute(
		params: SearchServicesUseCaseRequest,
	): Promise<SearchServicesUseCaseResponse> {
		const response = await this.serviceRepository.searchServices(params);
		return right(response);
	}
}
