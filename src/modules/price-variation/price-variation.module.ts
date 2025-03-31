import { Module } from "@nestjs/common";
import { AnimalModule } from "../animal/animal.module";
import { PriceStrategyProvider } from "./application/providers/price-strategy.provider";
import { CalculatePriceVariationUseCase } from "./application/use-cases/calculate-price-variation.use-case";
import { PriceVariationRepository } from "./domain/repositories/price-variation.repository";
import { PrismaPriceVariationRepository } from "./infra/database/repositories/prisma-price-variation.repository";

@Module({
	imports: [AnimalModule],
	providers: [
		CalculatePriceVariationUseCase,
		PriceStrategyProvider,
		{
			provide: PriceVariationRepository,
			useClass: PrismaPriceVariationRepository,
		},
	],
})
export class PriceVariationModule {}
