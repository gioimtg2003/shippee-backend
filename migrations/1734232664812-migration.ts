import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734232664812 implements MigrationInterface {
  name = 'Migration1734232664812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "loadWeight" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "loadWeight"`);
  }
}
