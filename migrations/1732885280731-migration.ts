import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732885280731 implements MigrationInterface {
  name = 'Migration1732885280731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD "isRejected" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "isRejected"`);
  }
}
