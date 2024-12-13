import { PRICE_TYPE_ENUM } from '@constants';
import { ExceedSegmentPriceEntity } from '@features/price-calculate/enities/exceed-segment-price.entity';

/**
 * Converts a given price to a specific price type.
 *
 * @param price - The price value to be converted.
 * @param priceType - The type of price conversion to apply. It can be either FIXED or another type defined in PRICE_TYPE_ENUM.
 * @returns The converted price. If the price type is FIXED, it returns the original price. Otherwise, it divides the price by 100.
 */
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
