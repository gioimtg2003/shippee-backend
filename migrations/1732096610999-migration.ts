import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732096610999 implements MigrationInterface {
  name = 'Migration1732096610999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(255) NOT NULL, "username" character varying(20) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56" UNIQUE ("username"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
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
      `CREATE TABLE "driver_identity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "province" character varying(60) NOT NULL, "district" character varying(60) NOT NULL, "ward" character varying(60) NOT NULL, "identityCardNumber" character varying(12) NOT NULL, "driverLicenseNumber" character varying(12) NOT NULL, "licensePlates" character(15) NOT NULL, "imgIdentityCardFront" character varying(100) NOT NULL, "imgIdentityCardBack" character varying(100) NOT NULL, "imgDriverLicenseFront" character varying(100) NOT NULL, "imgDriverLicenseBack" character varying(100) NOT NULL, "imgDriverLicenseWithDriver" character varying(100) NOT NULL, "imgVehicleRegistrationCertFront" character varying(100) NOT NULL, "imgVehicleRegistrationCertBack" character varying(100) NOT NULL, "imgVehicle" character varying(100) NOT NULL, "driverId" integer, CONSTRAINT "REL_d3086b9a2cc27c092553b029ee" UNIQUE ("driverId"), CONSTRAINT "PK_634c4f7df9c47ab770f31960ede" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."drivers_state_enum" AS ENUM('OFFLINE', 'FREE', 'DELIVERY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(60) NOT NULL, "email" character varying(60), "password" character varying(255) NOT NULL, "phone" character(12), "balance" integer NOT NULL DEFAULT '0', "isIdentityVerified" boolean NOT NULL DEFAULT false, "isOnline" boolean NOT NULL DEFAULT false, "state" "public"."drivers_state_enum" NOT NULL DEFAULT 'OFFLINE', "idOrder" integer, "transportTypeId" integer, CONSTRAINT "UQ_d4cfc1aafe3a14622aee390edb2" UNIQUE ("email"), CONSTRAINT "UQ_b97a5a68c766d2d1ec25e6a85b2" UNIQUE ("phone"), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transport_types" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(40) NOT NULL, "icon" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "PK_798b40b4bdf4aa75d716cdf954c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_history_status_enum" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'SUCCESS', 'RETURN', 'RETURNING', 'RETURNED', 'CANCELED', 'RELEASE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_status_history" ("id" SERIAL NOT NULL, "status" "public"."order_status_history_status_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "orderId" integer, CONSTRAINT "PK_e6c66d853f155531985fc4f6ec8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(60) NOT NULL, "email" character varying NOT NULL, "password" character varying(255) NOT NULL, "phone" character(12), "province" character varying, "district" character varying, "ward" character varying, "address" character varying, "isVerified" boolean NOT NULL DEFAULT false, "otp" character(6), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174" UNIQUE ("phone"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_transporttype_enum" AS ENUM('BIKE', 'VAN_500', 'VAN_1T', 'TRUCK_1T', 'TRUCK_1T5', 'TRUCK_2T')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_currentstatus_enum" AS ENUM('PENDING', 'PENDING_PICKUP', 'PICKED_UP', 'SUCCESS', 'RETURN', 'RETURNING', 'RETURNED', 'CANCELED', 'RELEASE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "cusName" character varying(60) NOT NULL, "pickup" jsonb NOT NULL, "cusPhone" character(12) NOT NULL, "recipientName" character varying(60) NOT NULL, "destination" jsonb NOT NULL, "recipientPhone" character(12) NOT NULL, "transportType" "public"."orders_transporttype_enum" NOT NULL, "cod" jsonb, "isDeliveryCharge" boolean NOT NULL DEFAULT false, "deliveryCharge" numeric(6,2) NOT NULL DEFAULT '0', "currentStatus" "public"."orders_currentstatus_enum" NOT NULL, "deliveryWindow" tstzrange, "note" character varying(255), "customerId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" ADD CONSTRAINT "FK_6846e5d2a031a43c2520c66c6a6" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" ADD CONSTRAINT "FK_36e011562881b86f13e42bb4185" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD CONSTRAINT "FK_d3086b9a2cc27c092553b029eee" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD CONSTRAINT "FK_4a892ca750d0dabf7209ce66e24" FOREIGN KEY ("transportTypeId") REFERENCES "transport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE "drivers" DROP CONSTRAINT "FK_4a892ca750d0dabf7209ce66e24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP CONSTRAINT "FK_d3086b9a2cc27c092553b029eee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" DROP CONSTRAINT "FK_36e011562881b86f13e42bb4185"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" DROP CONSTRAINT "FK_6846e5d2a031a43c2520c66c6a6"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_currentstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_transporttype_enum"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "order_status_history"`);
    await queryRunner.query(
      `DROP TYPE "public"."order_status_history_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "transport_types"`);
    await queryRunner.query(`DROP TABLE "drivers"`);
    await queryRunner.query(`DROP TYPE "public"."drivers_state_enum"`);
    await queryRunner.query(`DROP TABLE "driver_identity"`);
    await queryRunner.query(`DROP TABLE "wallet_histories"`);
    await queryRunner.query(
      `DROP TYPE "public"."wallet_histories_action_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."wallet_histories_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
