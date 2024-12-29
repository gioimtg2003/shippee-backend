import { OrderModule } from '@features/order';
import { Module } from '@nestjs/common';
import { CustomerOrderService } from './customer-order.service';

@Module({
  imports: [OrderModule],
  providers: [CustomerOrderService],
})
export class CustomerOrderModule {}
