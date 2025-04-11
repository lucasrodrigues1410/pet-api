import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Service } from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface ListServicesByCompanyUseCaseRequest {
	companyId: string;
}

type ListActiveServicesUseCaseResponse = Either<
	null,
	{
		services: (Service & {
			pricesRange: number[];
		})[];
	}
>;

@Injectable()
export class ListServicesByCompanyUseCase {
	constructor(private readonly serviceRepository: ServiceRepository) {}

	async execute({
		companyId,
	}: ListServicesByCompanyUseCaseRequest): Promise<ListActiveServicesUseCaseResponse> {
		const services = await this.serviceRepository.findByCompanyId(companyId);
		const mappedServices = services.map((service) => ({
			...service,
			pricesRange: this.getPriceRange(service),
		})) as (Service & { pricesRange: number[] })[];

		return right({ services: mappedServices });
	}

	private getPriceRange(service: Service): number[] {
		const basePrice = service.price;
		const variations = service.priceVariations?.map((v) => v.price) ?? [];
		const maxPrice =
			variations.length > 0 ? Math.max(...variations) : basePrice;
		return [basePrice, maxPrice];
	}
}
