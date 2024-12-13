import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734060446725 implements MigrationInterface {
  name = 'Migration1734060446725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "priceItems"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "priceItems" text array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "priceItems"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "priceItems" jsonb array NOT NULL`,
    );
  }
}
