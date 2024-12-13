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

  /**
   * Sets the price calculation strategy to be used.
   *
   * @param strategy - An instance of a class that implements the IPriceCalculationStrategy interface.
   */
  setStrategy(strategy: IPriceCalculationStrategy) {
    this.priceCalculationStrategy = strategy;
  }

  /**
   * Calculates the price based on the provided data and options.
   *
   * @template T - The type of the result object, defaults to an object with string keys and number values.
   * @param {IPriceCalculationData} data - The data required for price calculation.
   * @param {IPriceCalculationOptions} [options] - Optional parameters that may affect the price calculation.
   * @returns {T} The calculated price result.
   */
  calculate<T = { [key: string]: number }>(
    data: IPriceCalculationData,
    options?: IPriceCalculationOptions,
  ): T {
    return this.priceCalculationStrategy.calculate<T>(data, options);
  }
}
