import { Injectable } from "@nestjs/common";
import type { PriceVariationStrategy } from "../../domain/strategies/price-variation.strategy";
import { VariationType } from "../../domain/entities/price-variation.entity";

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