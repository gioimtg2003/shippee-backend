import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733584241228 implements MigrationInterface {
  name = 'Migration1733584241228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_assignments_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'CANCELED', 'EXPIRE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_assignments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "public"."order_assignments_status_enum" NOT NULL DEFAULT 'PENDING', "driverId" integer, "orderId" integer, CONSTRAINT "PK_519d4a549818b74ed40f72dd893" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD "acceptanceRate" integer NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" ADD CONSTRAINT "FK_d77e417aee937376759f9225803" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" ADD CONSTRAINT "FK_be2c5ad5e40bd737781a9b6c2c4" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_assignments" DROP CONSTRAINT "FK_be2c5ad5e40bd737781a9b6c2c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" DROP CONSTRAINT "FK_d77e417aee937376759f9225803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" DROP COLUMN "acceptanceRate"`,
    );
    await queryRunner.query(`DROP TABLE "order_assignments"`);
    await queryRunner.query(
      `DROP TYPE "public"."order_assignments_status_enum"`,
    );
  }
}
