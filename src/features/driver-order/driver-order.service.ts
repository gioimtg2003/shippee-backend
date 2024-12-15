import { DriverSession } from '@common/dto';
import { OrderService } from '@features/order/order.service';
import { RedisCacheService } from '@features/redis';
import { Injectable, Logger } from '@nestjs/common';
import { LessThanOrEqual } from 'typeorm';
import { PickOrderCommand } from './command';

@Injectable()
export class DriverOrderService {
  private readonly logger = new Logger(DriverOrderService.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly cacheService: RedisCacheService,
    private readonly pickOrderCommand: PickOrderCommand,
  ) {}

  async getOrderPending(driver: DriverSession) {
    this.logger.log(`Get order pending for driver ${driver.id}`);
    const driverSession = await this.cacheService.get(`driver:${driver.id}`);
    const driverObject = JSON.parse(driverSession);

    return this.orderService.getOrderPending(
      {
        loadWeight: LessThanOrEqual(driverObject['loadWeight']),
      },
      {
        id: true,
        pickup: { address: true, coordinates: true },
        destination: { address: true, coordinates: true },
        totalPrice: true,
      },
    );
  }

  async pickupOrder(driver: DriverSession, orderId: number) {
    this.logger.log(`Pick up order ${orderId} for driver ${driver.id}`);
    await this.pickOrderCommand.execute({
      idDriver: driver.id,
      idOrder: orderId,
    });

    return true;
  }

  getOrderPendingDetail(orderId: number) {
    return this.orderService.findById(orderId);
  }
}
