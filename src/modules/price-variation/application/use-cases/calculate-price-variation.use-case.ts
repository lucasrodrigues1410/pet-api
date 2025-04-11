import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { PriceVariationRepository } from "../../domain/repositories/price-variation.repository";
import { PriceVariationInput } from "../../domain/strategies/price-variation.strategy";
import { PriceStrategyProvider } from "../providers/price-strategy.provider";

interface CalculatePriceVariationUseCaseRequest {
	animalId: string;
	serviceId: string;
}

type CalculatePriceVariationUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		price: number;
	}
>;

@Injectable()
export class CalculatePriceVariationUseCase {
	constructor(
		private readonly animalRepository: AnimalRepository,
		private readonly priceVariationRepository: PriceVariationRepository,
		private readonly strategyProvider: PriceStrategyProvider,
	) {}

	async execute({
		animalId,
		serviceId,
	}: CalculatePriceVariationUseCaseRequest): Promise<CalculatePriceVariationUseCaseResponse> {
		const animal = await this.animalRepository.getById(animalId);
		if (!animal) {
			return left(new ResourceNotFoundError("Animal não encontrado"));
		}

		const priceVariations =
			await this.priceVariationRepository.findByServiceId(serviceId);

		let prices = 0;

		for (const variation of priceVariations) {
			const strategy = this.strategyProvider.getStrategy(
				variation.variation as any,
			);

			if (!strategy) continue;

			const calculationInput: PriceVariationInput = {
				animal: animal,
				variationData: variation,
			};
			prices += strategy.calculate(calculationInput) || 0;
		}

		return right({
			price: prices,
		});
	}
}
