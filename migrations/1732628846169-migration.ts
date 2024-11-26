import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732628846169 implements MigrationInterface {
  name = 'Migration1732628846169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "province"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "district"`,
    );
    await queryRunner.query(`ALTER TABLE "driver_identity" DROP COLUMN "ward"`);
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "images"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgIdentityCardFront" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgIdentityCardBack" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgDriverLicenseFront" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgDriverLicenseBack" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgVehicleRegistrationCertFront" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgVehicleRegistrationCertBack" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgVehicleRegistrationCertBack"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgVehicleRegistrationCertFront"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgDriverLicenseBack"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgDriverLicenseFront"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgIdentityCardBack"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgIdentityCardFront"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "images" text array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "ward" character varying(60) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "district" character varying(60) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "province" character varying(60) NOT NULL`,
    );
  }
}
