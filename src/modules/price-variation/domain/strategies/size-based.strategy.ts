import { Injectable } from "@nestjs/common";
import type {
	PriceVariationInput,
	PriceVariationStrategy,
} from "./price-variation.strategy";
import { VariationType } from "../entities/price-variation.entity";

@Injectable()
export class SizeBasedStrategy implements PriceVariationStrategy {
	supportedType = VariationType.SIZE;

	calculate({ contextValue, variation }: PriceVariationInput): number | null {
		if (!contextValue || Number.isNaN(contextValue)) {
			return null;
		}

		const animalWeight = Number(contextValue);

		let isApplicable = false;
		switch (variation.value) {
			case "SMALL":
				isApplicable = animalWeight <= 10;
				break;
			case "MEDIUM":
				isApplicable = animalWeight > 10 && animalWeight <= 25;
				break;
			case "LARGE":
				isApplicable = animalWeight > 25;
				break;
		}

		if (isApplicable) {
			return Number(variation.price);
		}

		return null;
	}
}
