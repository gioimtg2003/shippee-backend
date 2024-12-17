import { CoreEntity } from '@common/entities';
import { WALLET_ACTION_ENUM, WALLET_STATUS_ENUM } from '@constants';
import { AdminEntity } from '@features/admin/entities';
import { DriverEntity } from '@features/driver/entities/driver.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, ManyToOne, Relation } from 'typeorm';

@Entity('wallet_histories')
export class WalletHistoryEntity extends CoreEntity {
  @Column({
    type: 'enum',
    enum: WALLET_STATUS_ENUM,
    default: WALLET_STATUS_ENUM.PENDING,
  })
  @ApiProperty({
    enum: WALLET_STATUS_ENUM,
    example: WALLET_STATUS_ENUM.PENDING,
  })
  status: WALLET_STATUS_ENUM;

  @Column({ type: 'enum', enum: WALLET_ACTION_ENUM })
  @ApiProperty({ enum: WALLET_ACTION_ENUM })
  action: WALLET_ACTION_ENUM;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ example: 'https://example.com/screenshot.png' })
  screenHot: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index({ unique: true })
  @ApiProperty({ example: '123456' })
  code: string;

  @Column()
  @ApiProperty({ example: 100000 })
  amount: number;

  @ManyToOne(() => AdminEntity)
  admin: Relation<AdminEntity>;

  @ManyToOne(() => DriverEntity)
  driver: Relation<DriverEntity>;
}
