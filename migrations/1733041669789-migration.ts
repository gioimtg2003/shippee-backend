import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733041669789 implements MigrationInterface {
  name = 'Migration1733041669789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "gateway" character varying NOT NULL, "transaction_date" TIMESTAMP NOT NULL, "accountNumber" character varying NOT NULL, "subAccount" character varying, "code" character varying NOT NULL, "content" character varying NOT NULL, "transferType" character varying NOT NULL, "description" character varying NOT NULL, "transferAmount" integer NOT NULL, "referenceCode" character varying NOT NULL, "accumulated" integer NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" DROP CONSTRAINT "UQ_b97a5a68c766d2d1ec25e6a85b2"`,
    );
    await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "phone"`);
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD "phone" character varying(12)`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD CONSTRAINT "UQ_b97a5a68c766d2d1ec25e6a85b2" UNIQUE ("phone")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drivers" DROP CONSTRAINT "UQ_b97a5a68c766d2d1ec25e6a85b2"`,
    );
    await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "drivers" ADD "phone" character(12)`);
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD CONSTRAINT "UQ_b97a5a68c766d2d1ec25e6a85b2" UNIQUE ("phone")`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
