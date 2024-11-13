import { TRANSPORT_TYPE } from '@constants';
import { DriverEntity } from '@features/driver/entities/driver.entity';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { CoreEntity } from './core.entity';

@Entity('transport_types')
export class TransportTypeEntity extends CoreEntity {
  @Column({ type: 'varchar', length: TRANSPORT_TYPE.LIMIT_NAME })
  name: string;

  @Column({ type: 'varchar', length: TRANSPORT_TYPE.LIMIT_ICON })
  icon: string;

  @Column({ length: TRANSPORT_TYPE.LIMIT_DESCRIPTION })
  description: string;

  @OneToOne(() => DriverEntity)
  @JoinColumn()
  driver: Relation<DriverEntity>;
}
