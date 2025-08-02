import { PRICE_TYPE_ENUM } from '@constants';
import { SpecialRequireItemEntity } from '@features/special-require/special-require-item.entity';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';
import { Module } from '@nestjs/common';
import { DefaultPriceStrategy } from './default-price.strategy';
import { ExceedPriceStrategy } from './exceed-price.strategy';

export const PRICING_STRATEGIES = Symbol('PRICING_STRATEGIES');

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

@Module({
  providers: [
    {
      provide: PRICING_STRATEGIES,
      useFactory: (
        defaultStrategy: DefaultPriceStrategy,
        exceedStrategy: ExceedPriceStrategy,
      ) => ({
        default: defaultStrategy,
        exceed: exceedStrategy,
      }),
      inject: [DefaultPriceStrategy, ExceedPriceStrategy],
    },
  ],
})
export class PricingStrategies {}
