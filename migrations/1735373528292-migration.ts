import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1735373528292 implements MigrationInterface {
  name = 'Migration1735373528292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "phone"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "phone" character varying(12)`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174" UNIQUE ("phone")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "phone"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "phone" character(12)`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174" UNIQUE ("phone")`,
    );
  }
}
