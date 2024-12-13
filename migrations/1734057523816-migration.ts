import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734057523816 implements MigrationInterface {
  name = 'Migration1734057523816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" SET DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "currentStatus" DROP DEFAULT`,
    );
  }
}
