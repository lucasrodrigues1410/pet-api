import { AnimalModule } from "@faker-js/faker/.";
import { Module } from "@nestjs/common";
import { CalculatePriceVariationUseCase } from "./application/use-cases/calculate-price-variation.use-case";
import { PriceVariationRepository } from "./domain/repositories/price-variation.repository";
import { PrismaPriceVariationRepository } from "./infra/database/repositories/prisma-price-variation.repository";
import { PriceStrategyProvider } from "./application/providers/price-strategy.provider";

@Module({
    imports: [AnimalModule],
    controllers: [PriceVariationModule],
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
