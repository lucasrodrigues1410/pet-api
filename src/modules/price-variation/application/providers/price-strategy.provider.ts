import { Injectable } from "@nestjs/common";
import { VariationType } from "../../domain/entities/price-variation.entity";
import type { PriceVariationStrategy } from "../../domain/strategies/price-variation.strategy";

@Injectable()
export class PriceStrategyProvider {
	private strategiesMap = new Map<VariationType, PriceVariationStrategy>();

	constructor(strategies: PriceVariationStrategy[]) {
		for (const strat of strategies) {
			this.strategiesMap.set(strat.supportedType, strat);
		}
	}

	getStrategy(type: VariationType): PriceVariationStrategy | undefined {
		return this.strategiesMap.get(type);
	}
}
