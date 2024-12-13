import { PRICE_TYPE_ENUM } from '@constants';
import { ExceedSegmentPriceEntity } from '@features/price-calculate/enities/exceed-segment-price.entity';

export const convertToPrice = (
  price: number,
  priceType: PRICE_TYPE_ENUM,
): number => {
  if (priceType === PRICE_TYPE_ENUM.FIXED) {
    return price;
  }

  return price / 100;
};

export const exceedDistancePrice = (
  distance: number,
  exceedSegmentPrices: Pick<
    ExceedSegmentPriceEntity,
    'priceExtra' | 'startExtraDistanceKm' | 'endExtraDistanceKm'
  >[],
) => {
  const segment = exceedSegmentPrices.find((segment) => {
    return (
      distance > segment.startExtraDistanceKm &&
      distance <= segment.endExtraDistanceKm
    );
  });
  return segment.priceExtra || 0;
};

export const calculatePriceInfo = (
  priceType: PRICE_TYPE_ENUM,
  value: number,
) => {
  return priceType === PRICE_TYPE_ENUM.FIXED ? value : value / 100;
};
