import { Inject, Injectable } from '@nestjs/common';
import {
  IPriceCalculationData,
  IPriceCalculationOptions,
  IPriceCalculationStrategy,
} from './interface';
import { PRICE_CALCULATION_STRATEGY } from './price-calculation-strategy.token';

@Injectable()
export class PriceCalculator {
  constructor(
    @Inject(PRICE_CALCULATION_STRATEGY)
    private priceCalculationStrategy: IPriceCalculationStrategy,
  ) {}

  setStrategy(strategy: IPriceCalculationStrategy) {
    this.priceCalculationStrategy = strategy;
  }

  calculate<T = { [key: string]: number }>(
    data: IPriceCalculationData,
    options?: IPriceCalculationOptions,
  ): T {
    return this.priceCalculationStrategy.calculate<T>(data, options);
  }
}
