import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733670828336 implements MigrationInterface {
  name = 'Migration1733670828336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "potentialDriverId" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "potentialDriverId"`,
    );
  }
}
