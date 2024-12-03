import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733241302206 implements MigrationInterface {
  name = 'Migration1733241302206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a21fc43cbc5405ad4ffd35e0c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" DROP COLUMN "code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" ADD "code" character varying(255)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a21fc43cbc5405ad4ffd35e0c9" ON "wallet_histories" ("code") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a21fc43cbc5405ad4ffd35e0c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" DROP COLUMN "code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_histories" ADD "code" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a21fc43cbc5405ad4ffd35e0c9" ON "wallet_histories" ("code") `,
    );
  }
}
