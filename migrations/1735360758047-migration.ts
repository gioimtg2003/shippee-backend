import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1735360758047 implements MigrationInterface {
  name = 'Migration1735360758047';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
