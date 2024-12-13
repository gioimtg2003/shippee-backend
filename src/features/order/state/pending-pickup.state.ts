import { ORDER_STATUS_ENUM } from '@constants';
import { OrderStatusService } from '@features/order-status/order-status.service';
import { Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from '../entities/order.entity';
import { OrderState } from './state';

@Injectable()
export class PendingPickupState implements OrderState {
  private readonly logger = new Logger(PendingPickupState.name);

  constructor(private readonly orderStatusService: OrderStatusService) {}

  async handle(order: OrderEntity): Promise<void> {
    if (order.currentStatus !== ORDER_STATUS_ENUM.PENDING_PICKUP) {
      return;
    }

    this.logger.log(`Order ${order.id} is pending pickup`);

    await this.orderStatusService.create({
      orderId: order.id,
      status: ORDER_STATUS_ENUM.PENDING_PICKUP,
    });
  }
}
