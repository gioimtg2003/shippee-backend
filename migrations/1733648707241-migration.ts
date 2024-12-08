import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733648707241 implements MigrationInterface {
  name = 'Migration1733648707241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "isOnline"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD "isOnline" boolean NOT NULL DEFAULT false`,
    );
  }
}
