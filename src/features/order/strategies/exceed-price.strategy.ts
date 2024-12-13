import { Injectable } from '@nestjs/common';
import { exceedDistancePrice } from '@utils';
import { IPriceCalculationData, IPriceCalculationStrategy } from './interface';

@Injectable()
export class ExceedPriceStrategy implements IPriceCalculationStrategy {
  /**
   * Calculates the exceed price and exceed distance based on the provided data.
   *
   * @template T - The type of the return value.
   * @param {IPriceCalculationData} data - The data required for price calculation, including distance and transport information.
   * @returns {T} An object containing the exceed price and exceed distance.
   */
  calculate<T>(data: IPriceCalculationData): T {
    const { distance, transport } = data;

    const exceedValue = exceedDistancePrice(
      distance,
      transport.exceedSegmentPrices,
    );

    const exceedDistance =
      distance - transport.exceedSegmentPrices[0].startExtraDistanceKm;

    const exceedPrice = exceedValue * exceedDistance;
    return { exceedPrice, exceedDistance } as T;
  }
}
