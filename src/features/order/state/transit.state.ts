import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../entities/order.entity';
import { OrderState } from './state';

@Injectable()
export class TransitState implements OrderState {
  handle(order: OrderEntity): void {}
}
