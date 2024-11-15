import { CoreEntity } from '@common/entities';
import { WALLET_ACTION_ENUM, WALLET_STATUS_ENUM } from '@constants';
import { AdminEntity } from '@features/admin/entities';
import { DriverEntity } from '@features/driver/entities/driver.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

@Entity('wallet_histories')
export class WalletHistoryEntity extends CoreEntity {
  @Column({
    type: 'enum',
    enum: WALLET_STATUS_ENUM,
    default: WALLET_STATUS_ENUM.PENDING,
  })
  status: WALLET_STATUS_ENUM;

  @Column({ type: 'enum', enum: WALLET_ACTION_ENUM })
  action: WALLET_ACTION_ENUM;

  @Column({ type: 'varchar', length: 255 })
  screenHot: string;

  @Column()
  amount: number;

  @ManyToOne(() => AdminEntity)
  admin: Relation<AdminEntity>;

  @ManyToOne(() => DriverEntity)
  driver: Relation<DriverEntity>;
}
