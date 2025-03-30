import { Injectable, Scope } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { SizeBasedStrategy } from "../../domain/strategies/size-based.strategy";
import { PriceVariationStrategy } from "../../domain/strategies/price-variation.strategy";

const strategyMap = {
  SIZE: SizeBasedStrategy,
};

export type VariationType = keyof typeof strategyMap;

@Injectable({ scope: Scope.REQUEST })
export class PriceStrategyProvider {
  constructor(private moduleRef: ModuleRef) {}

  getStrategy(variationType: string): PriceVariationStrategy | null {
    const StrategyClass = strategyMap[variationType as VariationType];
    if (!StrategyClass) {
      console.warn(`No strategy found for variation type: ${variationType}`);
      return null;
    }

    try {
        return this.moduleRef.get(StrategyClass, { strict: false });
    } catch (error) {
        console.error(`Could not get instance of strategy: ${StrategyClass.name}`, error);
        return null;
    }
  }
}
