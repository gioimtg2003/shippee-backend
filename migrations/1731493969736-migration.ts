import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1731493969736 implements MigrationInterface {
  name = 'Migration1731493969736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_history_status_enum" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'SUCCESS', 'CANCEL', 'RELEASE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_status_history" ("id" SERIAL NOT NULL, "status" "public"."order_status_history_status_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "orderId" integer, CONSTRAINT "PK_e6c66d853f155531985fc4f6ec8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_transporttype_enum" AS ENUM('BIKE', 'VAN_500', 'VAN_1T', 'TRUCK_1T', 'TRUCK_1T5', 'TRUCK_2T')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_currentstatus_enum" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'SUCCESS', 'CANCEL', 'RELEASE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "cusName" character varying(100) NOT NULL, "pickup" jsonb NOT NULL, "cusPhone" character(12) NOT NULL, "recipientName" character varying(100) NOT NULL, "destination" jsonb NOT NULL, "recipientPhone" character(12) NOT NULL, "transportType" "public"."orders_transporttype_enum" NOT NULL, "cod" jsonb, "isDeliveryCharge" boolean NOT NULL DEFAULT false, "deliveryCharge" numeric(6,2) NOT NULL DEFAULT '0', "currentStatus" "public"."orders_currentstatus_enum" NOT NULL, "deliveryWindow" tstzrange, "note" character varying(255), "customerId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "phone" character(12) NOT NULL, "province" character varying, "district" character varying, "ward" character varying, "address" character varying, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status_history" ADD CONSTRAINT "FK_689db3835e5550e68d26ca32676" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status_history" DROP CONSTRAINT "FK_689db3835e5550e68d26ca32676"`,
    );
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_currentstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_transporttype_enum"`);
    await queryRunner.query(`DROP TABLE "order_status_history"`);
    await queryRunner.query(
      `DROP TYPE "public"."order_status_history_status_enum"`,
    );
  }
}
