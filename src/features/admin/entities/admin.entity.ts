import { CoreEntity } from '@common/entities';
import { WalletHistoryEntity } from '@features/driver-wallet/entities/wallet-history.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

@Entity('admins')
export class AdminEntity extends CoreEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => WalletHistoryEntity, (walletHistory) => walletHistory.admin)
  walletHistories: Relation<WalletHistoryEntity[]>;
}
