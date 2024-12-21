import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734773582356 implements MigrationInterface {
  name = 'Migration1734773582356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "imgDelivered" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "imgDelivered"`);
  }
}
