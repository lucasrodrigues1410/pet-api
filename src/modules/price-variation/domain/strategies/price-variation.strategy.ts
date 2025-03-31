import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { PriceVariation } from "../entities/price-variation.entity";

export interface PriceVariationInput {
	animal: Animal;
	variationData: PriceVariation;
}

export interface PriceVariationStrategy {
	calculate(input: PriceVariationInput): number | null;
}
