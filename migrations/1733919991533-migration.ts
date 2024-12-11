import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733919991533 implements MigrationInterface {
  name = 'Migration1733919991533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transport_types" DROP CONSTRAINT "FK_0e1b07f44bf513e289f4c543215"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" DROP COLUMN "orderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "transportTypeId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_eca5b0fa42cc72df47416f8fdd5" FOREIGN KEY ("transportTypeId") REFERENCES "transport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_eca5b0fa42cc72df47416f8fdd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "transportTypeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" ADD "orderId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types" ADD CONSTRAINT "FK_0e1b07f44bf513e289f4c543215" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
