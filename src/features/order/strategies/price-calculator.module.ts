import { Module } from '@nestjs/common';
import { DefaultPriceStrategy } from './default-price.strategy';
import { ExceedPriceStrategy } from './exceed-price.strategy';
import { PRICE_CALCULATION_STRATEGY } from './price-calculation-strategy.token';
import { PriceCalculator } from './price-calculator';

@Module({
  providers: [
    ExceedPriceStrategy,
    PriceCalculator,
    DefaultPriceStrategy,
    {
      provide: PRICE_CALCULATION_STRATEGY,
      useClass: ExceedPriceStrategy,
    },
    {
      provide: PRICE_CALCULATION_STRATEGY,
      useClass: DefaultPriceStrategy,
    },
  ],
  exports: [PriceCalculator],
})
export class PriceCalculationModule {}
