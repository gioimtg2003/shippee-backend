import { OrderEntity } from '../entities/order.entity';

export interface OrderState {
  handle(order: OrderEntity): void;
}
