import { ORDER_STATUS_ENUM } from '@constants';
import { OrderStatusService } from '@features/order-status/order-status.service';
import { OrderService } from '@features/order/order.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CommandDriverOrder,
  IDataCommandDriverOrder,
} from './command.interface';

@Injectable()
export class ArrivedPickupOrder implements CommandDriverOrder {
  private readonly logger = new Logger(ArrivedPickupOrder.name);

  constructor(
    private readonly orderStatus: OrderStatusService,
    private readonly orderService: OrderService,
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

    if (order.currentStatus !== ORDER_STATUS_ENUM.PENDING_PICKUP) {
      this.logger.error(`Order is not pending pickup: ${data.idOrder}`);
      throw new BadRequestException('Order is not pending pickup');
    }

    await this.orderService.update(data.idOrder, {
      currentStatus: ORDER_STATUS_ENUM.ARRIVED_AT_PICKUP,
    });

    await this.orderStatus.create({
      orderId: data.idOrder,
      status: ORDER_STATUS_ENUM.ARRIVED_AT_PICKUP,
    });

    // Notification with socket
  }
}
