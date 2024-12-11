import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733892336254 implements MigrationInterface {
  name = 'Migration1733892336254';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "transportType"`);
    await queryRunner.query(`DROP TYPE "public"."orders_transporttype_enum"`);
    await queryRunner.query(
      `ALTER TABLE "transport_types" ADD "orderId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" ADD CONSTRAINT "FK_0e1b07f44bf513e289f4c543215" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transport_types" DROP CONSTRAINT "FK_0e1b07f44bf513e289f4c543215"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" DROP COLUMN "orderId"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_transporttype_enum" AS ENUM('BIKE', 'VAN_500', 'VAN_1T', 'TRUCK_1T', 'TRUCK_1T5', 'TRUCK_2T')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "transportType" "public"."orders_transporttype_enum" NOT NULL`,
    );
  }
}
