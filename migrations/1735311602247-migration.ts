import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1735311602247 implements MigrationInterface {
  name = 'Migration1735311602247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "isVerified"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "emailVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "customers" ADD "timeOtp" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "timeOtp"`);
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "emailVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "isVerified" boolean NOT NULL DEFAULT false`,
    );
  }
}
