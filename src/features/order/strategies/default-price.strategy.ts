import { Injectable } from '@nestjs/common';
import {
  IPriceCalculationData,
  IPriceCalculationOptions,
  IPriceCalculationStrategy,
} from './interface';

@Injectable()
export class DefaultPriceStrategy implements IPriceCalculationStrategy {
  /**
   * Calculates the price based on the provided data and options.
   *
   * @template T - The type of the return value.
   * @param {IPriceCalculationData} data - The data required for price calculation, including price and distance.
   * @param {IPriceCalculationOptions} options - The options for price calculation, including price type.
   * @returns {T} - The calculated price wrapped in an object of type T.
   */
  calculate<T>(
    data: IPriceCalculationData,
    options: IPriceCalculationOptions,
  ): T {
    const { price } = data;
    const { priceType } = options;

    const defaultPrice = priceType === 'FIXED' ? price : price / 100;

    return { defaultPrice } as T;
  }
}
