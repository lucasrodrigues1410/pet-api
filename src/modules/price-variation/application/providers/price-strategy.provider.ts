import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SizeBasedStrategy } from '../../domain/strategies/size-based.strategy';
import { PriceVariationStrategy } from '../../domain/strategies/price-variation.strategy';

export enum VariationTypeEnum {
  SIZE = 'SIZE',
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type PriceVariationStrategyType = new (...args: any[]) => PriceVariationStrategy;

const strategyMap: Record<VariationTypeEnum, PriceVariationStrategyType> = {
  [VariationTypeEnum.SIZE]: SizeBasedStrategy,
};

@Injectable()
export class PriceStrategyProvider {
  private readonly logger = new Logger(PriceStrategyProvider.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  getStrategy(variationType: VariationTypeEnum): PriceVariationStrategy | null {
    const StrategyClass = strategyMap[variationType];
    if (!StrategyClass) {
      this.logger.warn(`No strategy found for variation type: ${variationType}`);
      return null;
    }

    try {
      return this.moduleRef.get(StrategyClass, { strict: false });
    } catch (error) {
      this.logger.error(
        `Could not get instance of strategy: ${StrategyClass.name}`,
        error instanceof Error ? error.stack : String(error)
      );
      return null;
    }
  }
}