import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732430670712 implements MigrationInterface {
  name = 'Migration1732430670712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "name" character varying(60) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "driver_identity" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD "name" character varying(60) NOT NULL`,
    );
  }
}
