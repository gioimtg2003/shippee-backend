import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732109230259 implements MigrationInterface {
  name = 'Migration1732109230259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgDriverLicenseWithDriver"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgDriverLicenseWithDriver" character varying(100)`,
    );
  }
}
