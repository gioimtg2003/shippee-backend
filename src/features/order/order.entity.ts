import { CODEntity, CoreEntity, LocationEntity } from '@common/entities';
import {
  LIMIT_NAME,
  LIMIT_PHONE,
  NOTE_MAX_LENGTH,
  ORDER_STATUS_ENUM,
  TRANSPORT_TYPE_ENUM,
} from '@constants';
import { DriverEntity } from '@features/driver/entities';
import { OrderStatusEntity } from '@features/order-status/order-status.entity';
import { CustomerEntity } from '@features/user/customer.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

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

  @Column({ type: 'char', length: LIMIT_PHONE })
  recipientPhone: string;

  @Column({ type: 'enum', enum: TRANSPORT_TYPE_ENUM })
  transportType: TRANSPORT_TYPE_ENUM;

  @Column({ type: 'jsonb', nullable: true })
  cod: CODEntity;

  @Column({ type: 'boolean', default: false })
  isDeliveryCharge: boolean;

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
  deliveryCharge: number;

  @Column({ type: 'enum', enum: ORDER_STATUS_ENUM })
  currentStatus: ORDER_STATUS_ENUM;

  @Column({ type: 'tstzrange', nullable: true })
  deliveryWindow: string;

  @Column({ length: NOTE_MAX_LENGTH, nullable: true })
  note: string;

  @OneToMany(() => OrderStatusEntity, (orderStatus) => orderStatus.order)
  statusOrderHistory: Relation<OrderStatusEntity>[];

  @ManyToOne(() => DriverEntity)
  driver: Relation<DriverEntity>;
}
