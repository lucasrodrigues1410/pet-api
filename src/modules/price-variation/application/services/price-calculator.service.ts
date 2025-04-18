import { Injectable } from "@nestjs/common";
import { VariationContext } from "../../domain/entities/price-variation.entity";
import { PriceVariationRepository } from "../../domain/repositories/price-variation.repository";
import { PriceStrategyProvider } from "../providers/price-strategy.provider";

@Injectable()
export class PriceCalculator {
	constructor(
		private readonly strategyProvider: PriceStrategyProvider,
		private readonly priceVariationRepo: PriceVariationRepository,
	) {}

	async calculate(
		serviceId: string,
		contexts: VariationContext[],
	): Promise<number> {
		const variations = await this.priceVariationRepo.findByServiceId(serviceId);

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
