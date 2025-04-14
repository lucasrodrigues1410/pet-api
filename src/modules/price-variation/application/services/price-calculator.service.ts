import { Injectable } from "@nestjs/common";
import {
	PriceVariation,
	VariationContext,
} from "../../domain/entities/price-variation.entity";
import { PriceStrategyProvider } from "../providers/price-strategy.provider";

@Injectable()
export class PriceCalculator {
	constructor(private readonly strategyProvider: PriceStrategyProvider) {}

	async calculate(
		variations: PriceVariation[],
		contexts: VariationContext[],
	): Promise<number> {
		let total = 0;
		for (const v of variations) {
			const strategy = this.strategyProvider.getStrategy(v.variation as any);
			const ctx = contexts.find((c) => c.type === v.variation);
			if (!ctx || !strategy) continue;

			total +=
				strategy.calculate({
					variation: v,
					contextValue: ctx.value,
				}) || 0;
		}

		return total;
	}
}
