import { CoreEntity } from '@common/entities';
import { ORDER_ASSIGNMENT_STATUS_ENUM } from '@constants';
import { DriverEntity } from '@features/driver/entities';
import { OrderEntity } from '@features/order/entities/order.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

@Entity('order_assignments')
export class OrderAssignmentEntity extends CoreEntity {
  @ManyToOne(() => DriverEntity)
  driver: Relation<DriverEntity>;

  @ManyToOne(() => OrderEntity)
  order: Relation<OrderEntity>;

  @Column({
    type: 'enum',
    enum: ORDER_ASSIGNMENT_STATUS_ENUM,
    default: ORDER_ASSIGNMENT_STATUS_ENUM.ASSIGNED,
  })
  status: ORDER_ASSIGNMENT_STATUS_ENUM;
}
