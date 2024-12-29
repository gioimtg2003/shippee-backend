import { OrderService } from '@features/order/order.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomerOrderService {
  private readonly logger = new Logger(CustomerOrderService.name);

  constructor(private readonly orderService: OrderService) {}

  async getMyOrders(customerId: number) {
    return this.orderService.findByCustomer(customerId);
  }
}
