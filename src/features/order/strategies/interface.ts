import { PRICE_TYPE_ENUM } from '@constants';
import { SpecialRequireItemEntity } from '@features/special-require/special-require-item.entity';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';

export interface IPriceCalculationData {
  distance?: number;
  transport?: TransportTypeEntity;
  specialRequireItem?: SpecialRequireItemEntity[];
  price?: number;
}

export interface IPriceCalculationOptions {
  priceType?: PRICE_TYPE_ENUM;
  isSpecialRequire?: boolean;
}

export interface IPriceCalculationStrategy {
  calculate<T>(
    data: IPriceCalculationData,
    options?: IPriceCalculationOptions,
  ): T;
}
