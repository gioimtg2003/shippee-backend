import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732096977492 implements MigrationInterface {
  name = 'Migration1732096977492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "driversId" integer`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_211ed36ac70b33e1b5a39151508" FOREIGN KEY ("driversId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_211ed36ac70b33e1b5a39151508"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "driversId"`);
  }
}
