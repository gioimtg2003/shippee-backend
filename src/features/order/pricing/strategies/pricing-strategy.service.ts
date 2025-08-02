import { Inject, Injectable } from '@nestjs/common';
import {
  IPriceCalculationData,
  IPriceCalculationStrategy,
  PRICING_STRATEGIES,
} from '.';

@Injectable()
export class PricingStrategyService {
  private strategy: IPriceCalculationStrategy;

  constructor(
    @Inject(PRICING_STRATEGIES)
    private readonly strategies: Record<string, IPriceCalculationStrategy>,
  ) {}

  setStrategy(type: 'default' | 'exceed') {
    this.strategy = this.strategies[type];
  }

  calculate<T>(data: IPriceCalculationData): T {
    return this.strategy.calculate<T>(data);
  }
}
