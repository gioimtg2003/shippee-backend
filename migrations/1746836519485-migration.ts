import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746836519485 implements MigrationInterface {
  name = 'Migration1746836519485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."special_require_item_code_enum" RENAME TO "special_require_item_code_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."special_require_item_code_enum" AS ENUM('EXTRA_CAPACITY_W_EQUIPMENT', 'EXTRA_CAPACITY_W', 'ROUND_TRIP', 'DOOR_TO_DOOR_DRIVER', 'DOOR_TO_DOOR_DRIVER_HELPER', 'THERMAL_BAG', 'STATION')`,
    );
    await queryRunner.query(
      `ALTER TABLE "special_require_item" ALTER COLUMN "code" TYPE "public"."special_require_item_code_enum" USING "code"::"text"::"public"."special_require_item_code_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."special_require_item_code_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."special_require_item_code_enum_old" AS ENUM('DOOR_TO_DOOR_DRIVER', 'DOOR_TO_DOOR_DRIVER_HELPER', 'EXTRA_CAPACITY_W', 'EXTRA_CAPACITY_W_EQUIPMENT', 'ROUND_TRIP', 'THERMAL_BAG')`,
    );
    await queryRunner.query(
      `ALTER TABLE "special_require_item" ALTER COLUMN "code" TYPE "public"."special_require_item_code_enum_old" USING "code"::"text"::"public"."special_require_item_code_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."special_require_item_code_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."special_require_item_code_enum_old" RENAME TO "special_require_item_code_enum"`,
    );
  }
}
