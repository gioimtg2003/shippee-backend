import { DRIVER_STATUS_ENUM, ORDER_STATUS_ENUM } from '@constants';
import { DriverService } from '@features/driver/driver.service';
import { OrderStatusService } from '@features/order-status/order-status.service';
import { OrderService } from '@features/order/order.service';
import { RedisCacheService } from '@features/redis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CommandDriverOrder,
  IDataCommandDriverOrder,
} from './command.interface';

@Injectable()
export class DeliveryCompletedCommand implements CommandDriverOrder {
  private readonly logger = new Logger(DeliveryCompletedCommand.name);

  constructor(
    private readonly orderStatus: OrderStatusService,
    private readonly orderService: OrderService,
    private readonly driverService: DriverService,
    private readonly cacheService: RedisCacheService,
  ) {}

  async execute(data: IDataCommandDriverOrder): Promise<void> {
    this.logger.log(`Picked order: ${data.idOrder}`);

    const order = await this.orderService.findById(data.idOrder, [], {
      id: true,
      currentStatus: true,
    });

    if (!order) {
      this.logger.error(`Order not found: ${data.idOrder}`);
      throw new BadRequestException('Order not found');
    }

    if (order.currentStatus !== ORDER_STATUS_ENUM.ARRIVED_AT_RECIPIENT) {
      this.logger.error(`Driver is not arrived recipient: ${data.idOrder}`);
      throw new BadRequestException('Driver is not arrived recipient');
    }

    await this.orderService.update(data.idOrder, {
      currentStatus: ORDER_STATUS_ENUM.COMPLETED,
      imgDelivered: data.imgDelivered,
    });
    await this.orderStatus.create({
      orderId: data.idOrder,
      status: ORDER_STATUS_ENUM.COMPLETED,
    });
    await this.driverService.update(data.idDriver, {
      idOrder: null,
      state: DRIVER_STATUS_ENUM.FREE,
    });
    await this.cacheService.updateObject({
      key: `driver:${data.idDriver}`,
      value: {
        idOrder: null,
        state: DRIVER_STATUS_ENUM.FREE,
      },
    });

    // Notification
  }
}
