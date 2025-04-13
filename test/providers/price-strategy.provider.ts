import { PriceStrategyProvider } from "@/modules/price-variation/application/providers/price-strategy.provider";
import { VariationType } from "@/modules/price-variation/domain/entities/price-variation.entity";
import { SizeBasedStrategy } from "@/modules/price-variation/domain/strategies/size-based.strategy";

export class MockPriceStrategyProvider extends PriceStrategyProvider {
	getStrategy(type: VariationType) {
		if (type === "SIZE") {
			return new SizeBasedStrategy();
		}
		return undefined;
	}
}
