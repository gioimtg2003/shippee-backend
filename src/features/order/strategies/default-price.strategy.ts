import { Injectable } from '@nestjs/common';
import {
  IPriceCalculationData,
  IPriceCalculationOptions,
  IPriceCalculationStrategy,
} from './interface';

@Injectable()
export class DefaultPriceStrategy implements IPriceCalculationStrategy {
  calculate<T>(
    data: IPriceCalculationData,
    options: IPriceCalculationOptions,
  ): T {
    const { price, distance } = data;
    const { priceType } = options;

    const priceValue = priceType === 'FIXED' ? price : price / 100;
    const defaultPrice = priceValue * distance;

    return { defaultPrice } as T;
  }
}
