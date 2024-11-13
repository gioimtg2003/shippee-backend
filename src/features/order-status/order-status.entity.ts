import { ORDER_STATUS_ENUM } from '@constants';
import { OrderEntity } from '@features/order/order.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, Relation } from 'typeorm';

@Entity('order_status_history')
export class OrderStatusEntity {
  @Column({ primary: true, generated: 'increment' })
  id: number;

  @ManyToOne(() => OrderEntity)
  order: Relation<OrderEntity>;

  @Column({ type: 'enum', enum: ORDER_STATUS_ENUM })
  status: ORDER_STATUS_ENUM;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
