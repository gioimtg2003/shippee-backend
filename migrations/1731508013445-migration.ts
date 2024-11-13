import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1731508013445 implements MigrationInterface {
  name = 'Migration1731508013445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_histories_status_enum" AS ENUM('PENDING', 'REJECT', 'ACCEPT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_histories_action_enum" AS ENUM('DEPOSIT', 'WITHDRAW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_histories" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "public"."wallet_histories_status_enum" NOT NULL DEFAULT 'PENDING', "action" "public"."wallet_histories_action_enum" NOT NULL, "screenHot" character varying(255) NOT NULL, "amount" integer NOT NULL, "adminId" integer, "driverId" integer, CONSTRAINT "PK_96914ecfcb43b8698974e420302" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(255) NOT NULL, "username" character(20) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56" UNIQUE ("username"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "password" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "isVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "customers" ADD "otp" character(6)`);
    await queryRunner.query(
      `ALTER TABLE "transport_types" ADD "driverId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" ADD CONSTRAINT "UQ_a03c463caa2721545a94f91b972" UNIQUE ("driverId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD "password" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_history_status_enum" RENAME TO "order_status_history_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_history_status_enum" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'SUCCESS', 'RETURN', 'RETURNING', 'RETURNED', 'CANCELED', 'RELEASE')`,
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
      `CREATE TYPE "public"."orders_currentstatus_enum" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'SUCCESS', 'RETURN', 'RETURNING', 'RETURNED', 'CANCELED', 'RELEASE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" TYPE "public"."orders_currentstatus_enum" USING "currentStatus"::"text"::"public"."orders_currentstatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."orders_currentstatus_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" ADD CONSTRAINT "FK_a03c463caa2721545a94f91b972" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" ADD CONSTRAINT "FK_6846e5d2a031a43c2520c66c6a6" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" ADD CONSTRAINT "FK_36e011562881b86f13e42bb4185" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" DROP CONSTRAINT "FK_36e011562881b86f13e42bb4185"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" DROP CONSTRAINT "FK_6846e5d2a031a43c2520c66c6a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" DROP CONSTRAINT "FK_a03c463caa2721545a94f91b972"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_currentstatus_enum_old" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'SUCCESS', 'CANCEL', 'RELEASE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" TYPE "public"."orders_currentstatus_enum_old" USING "currentStatus"::"text"::"public"."orders_currentstatus_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."orders_currentstatus_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."orders_currentstatus_enum_old" RENAME TO "orders_currentstatus_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_history_status_enum_old" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'SUCCESS', 'CANCEL', 'RELEASE')`,
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
    await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "transport_types" DROP CONSTRAINT "UQ_a03c463caa2721545a94f91b972"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" DROP COLUMN "driverId"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "otp"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "isVerified"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "password"`);
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(`DROP TABLE "wallet_histories"`);
    await queryRunner.query(
      `DROP TYPE "public"."wallet_histories_action_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."wallet_histories_status_enum"`,
    );
  }
}
