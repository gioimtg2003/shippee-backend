import { DriverSession } from '@common/dto';
import { OrderService } from '@features/order/order.service';
import { Injectable, Logger } from '@nestjs/common';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class DriverOrderService {
  private readonly logger = new Logger(DriverOrderService.name);
  constructor(private readonly orderService: OrderService) {}

  getOrderPending(driver: DriverSession) {
    this.logger.log(`Get order pending for driver ${driver.id}`);

    return this.orderService.getOrderPending(
      {
        loadWeight: LessThanOrEqual(driver.loadWeight),
      },
      {
        id: true,
        pickup: { address: true, coordinates: true },
        destination: { address: true, coordinates: true },
      },
    );
  }
}
