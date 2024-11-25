import { CoreEntity, LocationEntity } from '@common/entities';
import {
  LIMIT_NAME,
  LIMIT_PHONE,
  NOTE_MAX_LENGTH,
  ORDER_STATUS_ENUM,
  TRANSPORT_TYPE_ENUM,
} from '@constants';
import { DriverEntity } from '@features/driver/entities';
import { OrderStatusEntity } from '@features/order-status/order-status.entity';
import { SpecialRequireItemEntity } from '@features/special-require/special-require-item.entity';
import { CustomerEntity } from '@features/user/customer.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

class CODEntity {
  isCOD: boolean;
  CODAmount: number;
}

class PriceItem {
  name: string;
  price: number;
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

  @Column({ type: 'enum', enum: TRANSPORT_TYPE_ENUM })
  transportType: TRANSPORT_TYPE_ENUM;

  @Column({ type: 'jsonb', nullable: true })
  cod: CODEntity;

  @Column({ type: 'boolean', default: false })
  isDeliveryCharge: boolean;

  @Column({ type: 'jsonb', array: true })
  priceItems: PriceItem[];

  @Column()
  totalPrice: number;

  @Column({ type: 'enum', enum: ORDER_STATUS_ENUM })
  currentStatus: ORDER_STATUS_ENUM;

  @Column({ type: 'tstzrange', nullable: true })
  deliveryWindow: string;

  @Column({ length: NOTE_MAX_LENGTH, nullable: true })
  note: string;

  @Column({ type: 'jsonb', array: true, default: [] })
  specialRequireItemPrice: SpecialRequireItemEntity[];

  @OneToMany(() => OrderStatusEntity, (orderStatus) => orderStatus.order)
  statusOrderHistory: Relation<OrderStatusEntity>[];

  @ManyToOne(() => DriverEntity)
  driver?: Relation<DriverEntity>;
}
