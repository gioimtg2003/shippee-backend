import { Injectable } from '@nestjs/common';
import { exceedDistancePrice } from '@utils';
import { IPriceCalculationData, IPriceCalculationStrategy } from './interface';

@Injectable()
export class ExceedPriceStrategy implements IPriceCalculationStrategy {
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
