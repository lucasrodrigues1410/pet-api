import { Injectable } from "@nestjs/common";
import { CacheRepository } from "@/core/domain/interfaces/cache-repository.interface";
import { Category } from "@/modules/category/domain/entities/category.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { Either, right } from "@/shared/either";
import { Service } from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";

interface GetServiceRecommendationsUseCaseRequest {
	limit?: number;
}

interface GetServiceRecommendationsUseCaseResponse {
	services: (Service & {
        company: Pick<Company, "id" | "name" | "contact">;
        categories: Pick<Category, "id" | "name">[];
    })[];
}

type GetServiceRecommendationsUseCaseResult = Either<
	never,
	GetServiceRecommendationsUseCaseResponse
>;

@Injectable()
export class GetServiceRecommendationsUseCase {
	private readonly CACHE_KEY = "service:recommendations";
	private readonly CACHE_TTL = 7 * 24 * 60 * 60;

	constructor(
		private serviceRepository: ServiceRepository,
		private cacheRepository: CacheRepository,
	) {}

	async execute(
		request: GetServiceRecommendationsUseCaseRequest,
	): Promise<GetServiceRecommendationsUseCaseResult> {
		const { limit = 10 } = request;

		const cachedData = await this.cacheRepository.get(this.CACHE_KEY);

		if (cachedData) {
			const parsedData = JSON.parse(cachedData);
			return right({
				services: parsedData.slice(0, limit),
			});
		}

		const services = await this.serviceRepository.findMostPopular(20);

		const formattedServices = services.map((service) => ({
			...service.toObject(),
			company: {
				id: service.company.id.toString(),
				name: service.company.name,
				contact: service.company.contact ?? null,
			},
			categories: service.categories.map((category) => ({
				id: category.id.toString(),
				name: category.name,
			})),
		}));

		await this.cacheRepository.set(
			this.CACHE_KEY,
			JSON.stringify(formattedServices),
			this.CACHE_TTL,
		);

		return right({
			services: services,
		});
	}
}
