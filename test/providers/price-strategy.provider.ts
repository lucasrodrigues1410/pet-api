import { PriceStrategyProvider } from "@/modules/price-variation/application/providers/price-strategy.provider";
import { SizeBasedStrategy } from "@/modules/price-variation/domain/strategies/size-based.strategy";
import { ModuleRef } from "@nestjs/core";

export class MockPriceStrategyProvider extends PriceStrategyProvider {
	constructor() {
		super({} as ModuleRef);
	}

	getStrategy(variationType: string) {
		if (variationType === "SIZE") {
			return new SizeBasedStrategy();
		}
		return null;
	}
}
