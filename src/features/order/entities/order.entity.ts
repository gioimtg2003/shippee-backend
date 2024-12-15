import { CoreEntity, LocationEntity } from '@common/entities';
import {
  LIMIT_NAME,
  LIMIT_PHONE,
  NOTE_MAX_LENGTH,
  ORDER_STATUS_ENUM,
} from '@constants';
import { DriverEntity } from '@features/driver/entities';
import { OrderStatusEntity } from '@features/order-status/order-status.entity';
import { OrderAssignmentEntity } from '@features/order/entities/order-assignment.entity';
import { SpecialRequireItemEntity } from '@features/special-require/special-require-item.entity';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';
import { CustomerEntity } from '@features/user/customer.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

class CODEntity {
  isCOD: boolean;
  CODAmount: number;
}

@Entity('orders')
export class OrderEntity extends CoreEntity {
  @ManyToOne(() => CustomerEntity)
  customer: Relation<CustomerEntity>;

  @Column({ type: 'varchar', length: LIMIT_NAME })
  cusName: string;

  @Column({ type: 'jsonb' })
  pickup: LocationEntity;

  @Column({ type: 'char', length: LIMIT_PHONE })
  cusPhone: string;

  @Column({ type: 'varchar', length: LIMIT_NAME })
  recipientName: string;

  @Column({ type: 'jsonb' })
  destination: LocationEntity;

  @Column()
  distanceTotal: number;

  @Column()
  exceedDistance: number;

  @Column({ type: 'char', length: LIMIT_PHONE })
  recipientPhone: string;

  @Column({ type: 'jsonb', nullable: true })
  cod: CODEntity;

  @Column({ type: 'boolean', default: false })
  isDeliveryCharge: boolean;

  @Column()
  loadWeight: number;

  @Column('text', { array: true })
  priceItems: string[];

  @Column()
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: ORDER_STATUS_ENUM,
    default: ORDER_STATUS_ENUM.PENDING,
  })
  currentStatus: ORDER_STATUS_ENUM;

  @Column({ type: 'tstzrange', nullable: true })
  deliveryWindow: string;

  @Column({ length: NOTE_MAX_LENGTH, nullable: true })
  note: string;

  @Column({ type: 'jsonb', array: true, default: [] })
  specialRequireItemPrice: SpecialRequireItemEntity[];

  @OneToMany(() => OrderStatusEntity, (orderStatus) => orderStatus.order)
  statusOrderHistory: Relation<OrderStatusEntity>[];

  @Column({ type: 'int4', nullable: true })
  potentialDriverId?: number;

  @ManyToOne(() => DriverEntity)
  driver?: Relation<DriverEntity>;

  @OneToMany(
    () => OrderAssignmentEntity,
    (orderAssignment) => orderAssignment.order,
  )
  assignments: Relation<OrderAssignmentEntity[]>;

  @ManyToOne(() => TransportTypeEntity)
  transportType: Relation<TransportTypeEntity>;
}
