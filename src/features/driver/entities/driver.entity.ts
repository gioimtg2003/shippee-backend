import { CoreEntity, TransportTypeEntity } from '@common/entities';
import { DRIVER_STATUS_ENUM, LIMIT_NAME, LIMIT_PHONE } from '@constants';
import { WalletHistoryEntity } from '@features/driver-wallet/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';

@Entity('drivers')
export class DriverEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME })
  name: string;

  @Column({ unique: true, length: LIMIT_NAME, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'char', length: LIMIT_PHONE, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'integer', default: 0 })
  balance: number;

  @Column({ type: 'boolean', default: false })
  isIdentityVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column({
    type: 'enum',
    enum: DRIVER_STATUS_ENUM,
    default: DRIVER_STATUS_ENUM.OFFLINE,
  })
  state: DRIVER_STATUS_ENUM;

  @Column({ default: null, nullable: true })
  idOrder: number;

  @OneToOne(() => TransportTypeEntity)
  @JoinColumn()
  transportType: TransportTypeEntity;

  @OneToMany(() => WalletHistoryEntity, (walletHistory) => walletHistory.driver)
  walletHistories: Relation<WalletHistoryEntity[]>;
}
