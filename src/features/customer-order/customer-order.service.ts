import { OrderService } from '@features/order/order.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomerOrderService {
  private readonly logger = new Logger(CustomerOrderService.name);

  constructor(private readonly orderService: OrderService) {}

  async getMyOrders(customerId: number) {
    this.logger.log(`Finding orders for customer ${customerId}`);

    return this.orderService.findByCustomer(customerId);
  }

  async getOrderDetail(customerId: number, orderId: number) {
    this.logger.log(`Finding order ${orderId} for customer ${customerId}`);

    return this.orderService.findByCustomerDetail(customerId, orderId);
  }
}
