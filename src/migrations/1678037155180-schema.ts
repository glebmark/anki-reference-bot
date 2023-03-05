import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1678037155180 implements MigrationInterface {
    name = 'schema1678037155180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "example" ADD "audioId" uuid`);
        await queryRunner.query(`ALTER TABLE "example" ADD CONSTRAINT "UQ_4d6a0167eca55f4170ee41edc98" UNIQUE ("audioId")`);
        await queryRunner.query(`ALTER TABLE "definition" ADD "audioId" uuid`);
        await queryRunner.query(`ALTER TABLE "definition" ADD CONSTRAINT "UQ_1fadac645bf40f7d6f836095540" UNIQUE ("audioId")`);
        await queryRunner.query(`ALTER TABLE "title" ADD "audioId" uuid`);
        await queryRunner.query(`ALTER TABLE "title" ADD CONSTRAINT "UQ_d87373f0cc973f7caf2e6e8b1cd" UNIQUE ("audioId")`);
        await queryRunner.query(`ALTER TABLE "example" ADD CONSTRAINT "FK_4d6a0167eca55f4170ee41edc98" FOREIGN KEY ("audioId") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "definition" ADD CONSTRAINT "FK_1fadac645bf40f7d6f836095540" FOREIGN KEY ("audioId") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "title" ADD CONSTRAINT "FK_d87373f0cc973f7caf2e6e8b1cd" FOREIGN KEY ("audioId") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "title" DROP CONSTRAINT "FK_d87373f0cc973f7caf2e6e8b1cd"`);
        await queryRunner.query(`ALTER TABLE "definition" DROP CONSTRAINT "FK_1fadac645bf40f7d6f836095540"`);
        await queryRunner.query(`ALTER TABLE "example" DROP CONSTRAINT "FK_4d6a0167eca55f4170ee41edc98"`);
        await queryRunner.query(`ALTER TABLE "title" DROP CONSTRAINT "UQ_d87373f0cc973f7caf2e6e8b1cd"`);
        await queryRunner.query(`ALTER TABLE "title" DROP COLUMN "audioId"`);
        await queryRunner.query(`ALTER TABLE "definition" DROP CONSTRAINT "UQ_1fadac645bf40f7d6f836095540"`);
        await queryRunner.query(`ALTER TABLE "definition" DROP COLUMN "audioId"`);
        await queryRunner.query(`ALTER TABLE "example" DROP CONSTRAINT "UQ_4d6a0167eca55f4170ee41edc98"`);
        await queryRunner.query(`ALTER TABLE "example" DROP COLUMN "audioId"`);
    }

}
