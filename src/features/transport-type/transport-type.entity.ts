import { CoreEntity } from '@common/entities';
import { TRANSPORT_TYPE } from '@constants';
import { DriverEntity } from '@features/driver/entities/driver.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

@Entity('transport_types')
export class TransportTypeEntity extends CoreEntity {
  @Column({ type: 'varchar', length: TRANSPORT_TYPE.LIMIT_NAME })
  name: string;

  @Column({ type: 'varchar', length: TRANSPORT_TYPE.LIMIT_ICON })
  icon: string;

  @Column({ length: TRANSPORT_TYPE.LIMIT_DESCRIPTION })
  description: string;

  @OneToMany(() => DriverEntity, (driver) => driver.transportType)
  driver: Relation<DriverEntity[]>;
}
