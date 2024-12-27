import { CoreEntity, LocationEntity } from '@common/entities';
import {
  LIMIT_NAME,
  LIMIT_PHONE,
  NOTE_MAX_LENGTH,
  ORDER_PAYER_ENUM,
  ORDER_STATUS_ENUM,
} from '@constants';
import { CustomerEntity } from '@features/customer/customer.entity';
import { DriverEntity } from '@features/driver/entities';
import { OrderStatusEntity } from '@features/order-status/order-status.entity';
import { OrderAssignmentEntity } from '@features/order/entities/order-assignment.entity';
import { SpecialRequireItemEntity } from '@features/special-require/special-require-item.entity';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

class CODEntity {
  isCOD: boolean;
  CODAmount: number;
}

@Entity('orders')
export class OrderEntity extends CoreEntity {
  @ApiProperty({ type: () => CustomerEntity })
  @ManyToOne(() => CustomerEntity)
  customer: Relation<CustomerEntity>;

  @ApiProperty()
  @Column({ type: 'varchar', length: LIMIT_NAME })
  cusName: string;

  @ApiProperty({ type: () => LocationEntity })
  @Column({ type: 'jsonb' })
  pickup: LocationEntity;

  @ApiProperty()
  @Column({ type: 'char', length: LIMIT_PHONE })
  cusPhone: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: LIMIT_NAME })
  recipientName: string;

  @ApiProperty({ type: () => LocationEntity })
  @Column({ type: 'jsonb' })
  destination: LocationEntity;

  @ApiProperty()
  @Column()
  distanceTotal: number;

  @ApiProperty()
  @Column()
  exceedDistance: number;

  @ApiProperty()
  @Column({ type: 'char', length: LIMIT_PHONE })
  recipientPhone: string;

  @ApiProperty({ type: () => CODEntity })
  @Column({ type: 'jsonb', nullable: true })
  cod: CODEntity;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isDeliveryCharge: boolean;

  @ApiProperty({ enum: ORDER_PAYER_ENUM, default: ORDER_PAYER_ENUM.SENDER })
  @Column({
    type: 'enum',
    enum: ORDER_PAYER_ENUM,
    default: ORDER_PAYER_ENUM.SENDER,
  })
  payer: ORDER_PAYER_ENUM;

  @ApiProperty()
  @Column()
  loadWeight: number;

  @ApiProperty()
  @Column('text', { array: true })
  priceItems: string[];

  @ApiProperty()
  @Column()
  totalPrice: number;

  @ApiProperty({
    enum: ORDER_STATUS_ENUM,
    default: ORDER_STATUS_ENUM.PENDING,
  })
  @Column({
    type: 'enum',
    enum: ORDER_STATUS_ENUM,
    default: ORDER_STATUS_ENUM.PENDING,
  })
  currentStatus: ORDER_STATUS_ENUM;

  @ApiProperty()
  @Column({ type: 'tstzrange', nullable: true })
  deliveryWindow: string;

  @ApiProperty()
  @Column({ length: NOTE_MAX_LENGTH, nullable: true })
  note: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  imgDelivered: string;

  @ApiProperty({ type: () => SpecialRequireItemEntity, isArray: true })
  @Column({ type: 'jsonb', array: true, default: [] })
  specialRequireItemPrice: SpecialRequireItemEntity[];

  @ApiProperty({
    type: () => OrderStatusEntity,
    isArray: true,
  })
  @OneToMany(() => OrderStatusEntity, (orderStatus) => orderStatus.order)
  statusOrderHistory: Relation<OrderStatusEntity>[];

  @ApiProperty()
  @Column({ type: 'int4', nullable: true })
  potentialDriverId?: number;

  @ApiProperty({ type: () => DriverEntity })
  @ManyToOne(() => DriverEntity)
  driver?: Relation<DriverEntity>;

  @ApiProperty({ type: () => OrderAssignmentEntity, isArray: true })
  @OneToMany(
    () => OrderAssignmentEntity,
    (orderAssignment) => orderAssignment.order,
  )
  assignments: Relation<OrderAssignmentEntity[]>;

  @ApiProperty({
    type: () => TransportTypeEntity,
  })
  @ManyToOne(() => TransportTypeEntity)
  transportType: Relation<TransportTypeEntity>;
}
