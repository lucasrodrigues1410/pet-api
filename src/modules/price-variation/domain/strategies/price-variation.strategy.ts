import {PriceVariation, VariationType } from "../entities/price-variation.entity";

export type PriceVariationInput = {
	contextValue?: string | number;
	variation: PriceVariation;
}

export interface PriceVariationStrategy {
	supportedType: VariationType;
	calculate(input: PriceVariationInput): number | null;
}
