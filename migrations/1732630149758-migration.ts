import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732630149758 implements MigrationInterface {
  name = 'Migration1732630149758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD "isAiChecked" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "isAiChecked"`);
  }
}
