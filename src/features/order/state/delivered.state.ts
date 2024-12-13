import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../entities/order.entity';
import { OrderState } from './state';

@Injectable()
export class DeliveredState implements OrderState {
  handle(order: OrderEntity): void {}
}
