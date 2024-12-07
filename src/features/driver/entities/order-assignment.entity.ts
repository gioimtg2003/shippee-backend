import { CoreEntity } from '@common/entities';
import { ORDER_ASSIGNMENT_STATUS_ENUM } from '@constants';
import { OrderEntity } from '@features/order/entities/order.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { DriverEntity } from '.';

@Entity('order_assignments')
export class OrderAssignmentEntity extends CoreEntity {
  @ManyToOne(() => DriverEntity)
  driver: Relation<DriverEntity>;

  @ManyToOne(() => OrderEntity)
  order: Relation<OrderEntity>;

  @Column({
    type: 'enum',
    enum: ORDER_ASSIGNMENT_STATUS_ENUM,
    default: ORDER_ASSIGNMENT_STATUS_ENUM.PENDING,
  })
  status: ORDER_ASSIGNMENT_STATUS_ENUM;
}
