import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { PriceVariationRepository } from "../../domain/repositories/price-variation.repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found.error";
import { PriceStrategyProvider } from "../providers/price-strategy.provider";
import { PriceVariationInput } from "../../domain/strategies/price-variation.strategy";
import { NoApplicablePriceVariationError } from "../../domain/errors/no-applicable-price-variation.error";

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
		private readonly strategyFactory: PriceStrategyProvider,
	) {}

	async execute({
		animalId,
		serviceId,
	}: CalculatePriceVariationUseCaseRequest): Promise<CalculatePriceVariationUseCaseResponse> {
		const animal = await this.animalRepository.getById(animalId);
		if (!animal) {
			return left(new ResourceNotFoundError("Animal not found"));
		}

		const priceVariations =
			await this.priceVariationRepository.getAllByServiceId(serviceId);

		if (!priceVariations || priceVariations.length === 0) {
			return left(
				new NoApplicablePriceVariationError(
					`No price variations found for service ${serviceId}`,
				),
			);
		}

		for (const variation of priceVariations) {
			const strategy = this.strategyFactory.getStrategy(variation.variation);

			if (!strategy) {
				console.warn(
					`Skipping variation ${variation.id} due to missing strategy for type ${variation.variation}`,
				);
				continue;
			}

			const calculationInput: PriceVariationInput = {
				animal: animal,
				variationData: variation,
			};

			const calculatedPrice = strategy.calculate(calculationInput);

			if (calculatedPrice !== null) {
				return right({
					price: calculatedPrice,
				});
			}
		}

		return left(
			new NoApplicablePriceVariationError(
				`No applicable price variation found for animal ${animalId} and service ${serviceId}`,
			),
		);
	}
}
