import { CoreEntity } from '@common/entities';
import { LIMIT_NAME, LIMIT_NUMBER_ID, LIMIT_URL_IMG } from '@constants';
import { Column } from 'typeorm';

export class DriverIdentityEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME })
  province: string;

  @Column({ type: 'varchar', length: LIMIT_NAME })
  district: string;

  @Column({ type: 'varchar', length: LIMIT_NAME })
  ward: string;

  @Column({ type: 'varchar', length: LIMIT_NUMBER_ID })
  identityCardNumber: string;

  @Column({ type: 'varchar', length: LIMIT_NUMBER_ID })
  driverLicenseNumber: string;

  @Column({ type: 'char', length: 15 })
  licensePlates: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG })
  imgIdentityCardFront: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG })
  imgIdentityCardBack: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG })
  imgDriverLicenseFront: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG })
  imgDriverLicenseBack: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG })
  imgDriverLicenseWithDriver: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG })
  imgVehicleRegistrationCertFront: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG })
  imgVehicleRegistrationCertBack: string;

  @Column({ type: 'varchar', length: LIMIT_URL_IMG })
  imgVehicle: string;
}
