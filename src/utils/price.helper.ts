import { PRICE_TYPE_ENUM } from '@constants';

export const convertToPrice = (
  price: number,
  priceType: PRICE_TYPE_ENUM,
): number => {
  if (priceType === PRICE_TYPE_ENUM.FIXED) {
    return price;
  }

  return price / 100;
};
