import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732097050113 implements MigrationInterface {
  name = 'Migration1732097050113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_211ed36ac70b33e1b5a39151508"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" RENAME COLUMN "driversId" TO "driverId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_18dc786cf29d6ef99980ba6ae63" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_18dc786cf29d6ef99980ba6ae63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" RENAME COLUMN "driverId" TO "driversId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_211ed36ac70b33e1b5a39151508" FOREIGN KEY ("driversId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
