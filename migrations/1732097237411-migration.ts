import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732097237411 implements MigrationInterface {
  name = 'Migration1732097237411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "identityCardNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "driverLicenseNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "licensePlates" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgIdentityCardFront" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgIdentityCardBack" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgDriverLicenseFront" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgDriverLicenseBack" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgDriverLicenseWithDriver" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgVehicleRegistrationCertFront" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgVehicleRegistrationCertBack" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgVehicle" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgVehicle" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgVehicleRegistrationCertBack" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgVehicleRegistrationCertFront" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgDriverLicenseWithDriver" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgDriverLicenseBack" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgDriverLicenseFront" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgIdentityCardBack" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgIdentityCardFront" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "licensePlates" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "driverLicenseNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "identityCardNumber" SET NOT NULL`,
    );
  }
}
