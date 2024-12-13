import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../entities/order.entity';
import { OrderState } from './state';

@Injectable()
export class DeliveredState implements OrderState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(order: OrderEntity): void {}
}
