import { Injectable } from '@nestjs/common';
import {
  IPriceCalculationData,
  IPriceCalculationOptions,
  IPriceCalculationStrategy,
} from './';

@Injectable()
export class DefaultPriceStrategy implements IPriceCalculationStrategy {
  /**
   * Calculates the price based on the provided data and options.
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
