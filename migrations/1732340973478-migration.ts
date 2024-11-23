import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732340973478 implements MigrationInterface {
  name = 'Migration1732340973478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "driverLicenseNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgIdentityCardFront"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgIdentityCardBack"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgDriverLicenseFront"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgDriverLicenseBack"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgVehicleRegistrationCertFront"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgVehicleRegistrationCertBack"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "images" text array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "images"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgVehicleRegistrationCertBack" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgVehicleRegistrationCertFront" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgDriverLicenseBack" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgDriverLicenseFront" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgIdentityCardBack" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgIdentityCardFront" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "driverLicenseNumber" character varying(12)`,
    );
  }
}
