import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1731833948584 implements MigrationInterface {
  name = 'Migration1731833948584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56"`,
    );
    await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "admins" ADD "username" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ALTER COLUMN "email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drivers" ALTER COLUMN "email" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56"`,
    );
    await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "admins" ADD "username" character(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56" UNIQUE ("username")`,
    );
  }
}
