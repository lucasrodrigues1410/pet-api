import { Injectable } from "@nestjs/common";
import {
	PriceVariationInput,
	PriceVariationStrategy,
} from "./price-variation.strategy";

@Injectable()
export class SizeBasedStrategy implements PriceVariationStrategy {
	calculate({ animal, variationData }: PriceVariationInput): number | null {
		const animalWeight = animal.weight;

		if (!animalWeight) {
			return null;
		}

		let isApplicable = false;
		switch (variationData.value) {
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
			return Number(variationData.price);
		}

		return null;
	}
}
