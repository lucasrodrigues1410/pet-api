import { Module } from "@nestjs/common";
import { AnimalModule } from "../animal/animal.module";
import { PriceStrategyProvider } from "./application/providers/price-strategy.provider";
import { CalculatePriceVariationUseCase } from "./application/use-cases/calculate-price-variation.use-case";
import { PriceVariationRepository } from "./domain/repositories/price-variation.repository";
import { SizeBasedStrategy } from "./domain/strategies/size-based.strategy";
import { PrismaPriceVariationRepository } from "./infra/database/repositories/prisma-price-variation.repository";

@Module({
	imports: [AnimalModule],
	providers: [
		CalculatePriceVariationUseCase,
		PriceStrategyProvider,
		SizeBasedStrategy,
		{
			provide: PriceVariationRepository,
			useClass: PrismaPriceVariationRepository,
		},
	],
	exports: [CalculatePriceVariationUseCase],
})
export class PriceVariationModule {}
