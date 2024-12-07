import { CoreEntity } from '@common/entities';
import {
  ACCEPTANCE_RATE_MAX,
  DRIVER_STATUS_ENUM,
  LIMIT_NAME,
  LIMIT_PHONE,
} from '@constants';
import { WalletHistoryEntity } from '@features/driver-wallet/entities';
import { OrderEntity } from '@features/order/entities/order.entity';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { DriverIdentityEntity } from './driver-identity.entity';
import { OrderAssignmentEntity } from './order-assignment.entity';

@Entity('drivers')
export class DriverEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME, nullable: true })
  name: string;

  @Column({ unique: true, length: LIMIT_NAME, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'varchar',
    length: LIMIT_PHONE,
    unique: true,
    nullable: true,
  })
  phone: string;

  @Column({ type: 'integer', default: 0 })
  balance: number;

  @Column({ type: 'boolean', default: false })
  isIdentityVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isAiChecked: boolean; // AI check identity

  @Column({ type: 'boolean', default: false })
  isRejected: boolean; // AI check identity

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column({
    type: 'enum',
    enum: DRIVER_STATUS_ENUM,
    default: DRIVER_STATUS_ENUM.OFFLINE,
  })
  state: DRIVER_STATUS_ENUM;

  @Column({ type: 'integer', default: ACCEPTANCE_RATE_MAX })
  acceptanceRate: number;

  @Column({ default: null, nullable: true })
  idOrder: number;

  @ManyToOne(() => TransportTypeEntity)
  transportType: Relation<TransportTypeEntity>;

  @OneToMany(() => WalletHistoryEntity, (walletHistory) => walletHistory.driver)
  walletHistories: Relation<WalletHistoryEntity[]>;

  @OneToOne(() => DriverIdentityEntity, (identity) => identity.driver)
  identity: Relation<DriverIdentityEntity>;

  @OneToMany(() => OrderEntity, (order) => order.driver)
  orders: Relation<OrderEntity[]>;

  @OneToMany(
    () => OrderAssignmentEntity,
    (orderAssignment) => orderAssignment.driver,
  )
  assignments: OrderAssignmentEntity[];
}
