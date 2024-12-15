import { DriverSession } from '@common/dto';
import { OrderService } from '@features/order/order.service';
import { RedisCacheService } from '@features/redis';
import { Injectable, Logger } from '@nestjs/common';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class DriverOrderService {
  private readonly logger = new Logger(DriverOrderService.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly cacheService: RedisCacheService,
  ) {}

  async getOrderPending(driver: DriverSession) {
    this.logger.log(`Get order pending for driver ${driver.id}`);
    const driverSession = await this.cacheService.get(`driver:${driver.id}`);

    const weight = JSON.parse(driverSession)['loadWeight'];
    return this.orderService.getOrderPending(
      {
        loadWeight: LessThanOrEqual(weight),
      },
      {
        id: true,
        pickup: { address: true, coordinates: true },
        destination: { address: true, coordinates: true },
        totalPrice: true,
      },
    );
  }
}
