import { CoreEntity } from '@common/entities';
import { LIMIT_URL_IMG } from '@constants';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { DriverEntity } from './driver.entity';

@Entity('driver_identity')
export class DriverIdentityEntity extends CoreEntity {
  @Column({ type: 'text', nullable: true })
  identityCardNumber?: string;

  @Column({ type: 'text', nullable: true })
  licensePlates?: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG, nullable: true })
  imgIdentityCardFront: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG, nullable: true })
  imgIdentityCardBack: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG, nullable: true })
  imgDriverLicenseFront?: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG, nullable: true })
  imgDriverLicenseBack?: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG, nullable: true })
  imgVehicleRegistrationCertFront?: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG, nullable: true })
  imgVehicleRegistrationCertBack?: string;

  @OneToOne(() => DriverEntity, (driver) => driver.identity)
  @JoinColumn()
  driver: Relation<DriverEntity>;
}
