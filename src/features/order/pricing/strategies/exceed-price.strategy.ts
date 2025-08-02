import { ExceedSegmentPriceEntity } from '@features/price-calculate/entities/exceed-segment-price.entity';
import { Injectable } from '@nestjs/common';
import { IPriceCalculationData, IPriceCalculationStrategy } from './';

@Injectable()
export class ExceedPriceStrategy implements IPriceCalculationStrategy {
  private exceedDistancePrice(
    distance: number,
    exceedSegmentPrices: Pick<
      ExceedSegmentPriceEntity,
      'priceExtra' | 'startExtraDistanceKm' | 'endExtraDistanceKm'
    >[],
  ) {
    const segment = exceedSegmentPrices.find((segment) => {
      return (
        distance > segment.startExtraDistanceKm &&
        distance <= segment.endExtraDistanceKm
      );
    });
    return segment.priceExtra || 0;
  }
  /**
   * Calculates the exceed price and exceed distance based on the provided data.
   */
  calculate<T>(data: IPriceCalculationData): T {
    const { distance, transport } = data;

    const exceedValue = this.exceedDistancePrice(
      distance,
      transport.exceedSegmentPrices,
    );

    const exceedDistance =
      distance - transport.exceedSegmentPrices[0].startExtraDistanceKm;

    const exceedPrice = exceedValue * exceedDistance;
    return { exceedPrice, exceedDistance } as T;
  }
}
