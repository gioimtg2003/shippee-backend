import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733377310332 implements MigrationInterface {
  name = 'Migration1733377310332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "identityCardNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "identityCardNumber" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "licensePlates"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "licensePlates" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "licensePlates"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "licensePlates" character(15)`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "identityCardNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "identityCardNumber" character varying(12)`,
    );
  }
}
