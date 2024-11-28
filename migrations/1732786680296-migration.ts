import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732786680296 implements MigrationInterface {
  name = 'Migration1732786680296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgIdentityCardFront" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgIdentityCardBack" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgIdentityCardBack" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ALTER COLUMN "imgIdentityCardFront" SET NOT NULL`,
    );
  }
}
