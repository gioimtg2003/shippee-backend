import { CoreEntity } from '@common/entities';
import { TransportTypeEntity } from '@common/entities/transport-type.entity';
import { DRIVER_STATUS_ENUM, LIMIT_NAME, LIMIT_PHONE } from '@constants';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('drivers')
export class DriverEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME })
  name: string;

  @Column({ unique: true, length: LIMIT_NAME })
  email: string;

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
}
