import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732629629203 implements MigrationInterface {
  name = 'Migration1732629629203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drivers" ALTER COLUMN "name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drivers" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
