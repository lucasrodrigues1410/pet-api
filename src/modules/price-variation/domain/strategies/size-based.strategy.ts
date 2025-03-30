import { PriceVariationInput, PriceVariationStrategy } from "./price-variation.strategy";

export class SizeBasedStrategy implements PriceVariationStrategy {
  calculate({ animal, variationData }: PriceVariationInput): number | null {
    const animalWeight = animal.weight;

    if (!animalWeight) {
       return null;
    }

    let isApplicable = false;
    if (variationData.value === "SMALL" && animalWeight <= 10) {
      isApplicable = true;
    } else if (variationData.value === "MEDIUM" && animalWeight > 10 && animalWeight <= 25) {
      isApplicable = true;
    } else if (variationData.value === "LARGE" && animalWeight > 25) {
      isApplicable = true;
    }

    if (isApplicable) {
      return Number(variationData.price);
    }

    return null;
  }
}