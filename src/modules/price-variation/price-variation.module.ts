import { Module } from "@nestjs/common";
import { AnimalModule } from "../animal/animal.module";
import { PriceStrategyProvider } from "./application/providers/price-strategy.provider";
import { PriceVariationRepository } from "./domain/repositories/price-variation.repository";
import { SizeBasedStrategy } from "./domain/strategies/size-based.strategy";
import { PrismaPriceVariationRepository } from "./infra/database/repositories/prisma-price-variation.repository";
import type { PriceVariationStrategy } from "./domain/strategies/price-variation.strategy";
import { PriceCalculator } from "./application/services/price-calculator.service";

@Module({
	imports: [AnimalModule],
	providers: [
		PriceCalculator,
		SizeBasedStrategy,
		{
			provide: PriceStrategyProvider,
			useFactory: (...strategies: PriceVariationStrategy[]) =>
				new PriceStrategyProvider(strategies),
			inject: [SizeBasedStrategy],
		},
		{
			provide: PriceVariationRepository,
			useClass: PrismaPriceVariationRepository,
		},
	],
	exports: [PriceCalculator],
})
export class PriceVariationModule {}
