import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733670525550 implements MigrationInterface {
  name = 'Migration1733670525550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."order_assignments_status_enum" RENAME TO "order_assignments_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_assignments_status_enum" AS ENUM('ASSIGNED', 'REJECTED', 'EXPIRE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" ALTER COLUMN "status" TYPE "public"."order_assignments_status_enum" USING "status"::"text"::"public"."order_assignments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" ALTER COLUMN "status" SET DEFAULT 'ASSIGNED'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_assignments_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_assignments_status_enum_old" AS ENUM('PENDING', 'ACCEPTED', 'CANCELED', 'EXPIRE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" ALTER COLUMN "status" TYPE "public"."order_assignments_status_enum_old" USING "status"::"text"::"public"."order_assignments_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_assignments" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_assignments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_assignments_status_enum_old" RENAME TO "order_assignments_status_enum"`,
    );
  }
}
