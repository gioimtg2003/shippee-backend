import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732340014584 implements MigrationInterface {
  name = 'Migration1732340014584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" DROP COLUMN "imgVehicle"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_identity" ADD "imgVehicle" character varying(100)`,
    );
  }
}
