import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734760775501 implements MigrationInterface {
  name = 'Migration1734760775501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_history_status_enum" RENAME TO "order_status_history_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_history_status_enum" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'COMPLETED', 'RETURN', 'RETURNING', 'RETURNED', 'CANCELED', 'RELEASE', 'ARRIVED_AT_PICKUP', 'ARRIVED_AT_RECIPIENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status_history" ALTER COLUMN "status" TYPE "public"."order_status_history_status_enum" USING "status"::"text"::"public"."order_status_history_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_status_history_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."orders_currentstatus_enum" RENAME TO "orders_currentstatus_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_currentstatus_enum" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'COMPLETED', 'RETURN', 'RETURNING', 'RETURNED', 'CANCELED', 'RELEASE', 'ARRIVED_AT_PICKUP', 'ARRIVED_AT_RECIPIENT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" TYPE "public"."orders_currentstatus_enum" USING "currentStatus"::"text"::"public"."orders_currentstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."orders_currentstatus_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_currentstatus_enum_old" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'COMPLETED', 'RETURN', 'RETURNING', 'RETURNED', 'CANCELED', 'RELEASE', 'ARRIVED_AT_PICKUP')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" TYPE "public"."orders_currentstatus_enum_old" USING "currentStatus"::"text"::"public"."orders_currentstatus_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."orders_currentstatus_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."orders_currentstatus_enum_old" RENAME TO "orders_currentstatus_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_history_status_enum_old" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'COMPLETED', 'RETURN', 'RETURNING', 'RETURNED', 'CANCELED', 'RELEASE', 'ARRIVED_AT_PICKUP')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status_history" ALTER COLUMN "status" TYPE "public"."order_status_history_status_enum_old" USING "status"::"text"::"public"."order_status_history_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_status_history_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_history_status_enum_old" RENAME TO "order_status_history_status_enum"`,
    );
  }
}
