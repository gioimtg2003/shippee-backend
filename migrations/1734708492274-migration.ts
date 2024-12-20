import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734708492274 implements MigrationInterface {
  name = 'Migration1734708492274';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_payer_enum" AS ENUM('SENDER', 'RECIPIENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "payer" "public"."orders_payer_enum" NOT NULL DEFAULT 'SENDER'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payer"`);
    await queryRunner.query(`DROP TYPE "public"."orders_payer_enum"`);
  }
}
