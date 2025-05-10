import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746847178950 implements MigrationInterface {
  name = 'Migration1746847178950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "special_require_item" DROP CONSTRAINT "FK_b22b4b3cfd7565c31a301e07d6c"`,
    );
    await queryRunner.query(
      `CREATE TABLE "transport_types_special_require_items_special_require_item" ("transportTypesId" integer NOT NULL, "specialRequireItemId" integer NOT NULL, CONSTRAINT "PK_37ea8c246269e0b392f25fe900b" PRIMARY KEY ("transportTypesId", "specialRequireItemId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ffc36f3ff06df5907f211a7274" ON "transport_types_special_require_items_special_require_item" ("transportTypesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1747f895daab1cd410f1747bc5" ON "transport_types_special_require_items_special_require_item" ("specialRequireItemId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "special_require_item" DROP COLUMN "transportTypeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "special_require_item" ALTER COLUMN "code" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types_special_require_items_special_require_item" ADD CONSTRAINT "FK_ffc36f3ff06df5907f211a72748" FOREIGN KEY ("transportTypesId") REFERENCES "transport_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types_special_require_items_special_require_item" ADD CONSTRAINT "FK_1747f895daab1cd410f1747bc56" FOREIGN KEY ("specialRequireItemId") REFERENCES "special_require_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transport_types_special_require_items_special_require_item" DROP CONSTRAINT "FK_1747f895daab1cd410f1747bc56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transport_types_special_require_items_special_require_item" DROP CONSTRAINT "FK_ffc36f3ff06df5907f211a72748"`,
    );
    await queryRunner.query(
      `ALTER TABLE "special_require_item" ALTER COLUMN "code" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "special_require_item" ADD "transportTypeId" integer`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1747f895daab1cd410f1747bc5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ffc36f3ff06df5907f211a7274"`,
    );
    await queryRunner.query(
      `DROP TABLE "transport_types_special_require_items_special_require_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "special_require_item" ADD CONSTRAINT "FK_b22b4b3cfd7565c31a301e07d6c" FOREIGN KEY ("transportTypeId") REFERENCES "transport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
