import { CoreEntity } from '@common/entities';
import { LIMIT_NAME, LIMIT_NUMBER_ID } from '@constants';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { DriverEntity } from './driver.entity';

@Entity('driver_identity')
export class DriverIdentityEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME })
  province: string;

  @Column({ type: 'varchar', length: LIMIT_NAME })
  district: string;

  @Column({ type: 'varchar', length: LIMIT_NAME })
  ward: string;

  @Column({ type: 'varchar', length: LIMIT_NUMBER_ID, nullable: true })
  identityCardNumber: string;

  @Column({ type: 'char', length: 15, nullable: true })
  licensePlates: string;

  @Column('text', { array: true })
  images: string[];

  @OneToOne(() => DriverEntity, (driver) => driver.identity)
  @JoinColumn()
  driver: Relation<DriverEntity>;
}
