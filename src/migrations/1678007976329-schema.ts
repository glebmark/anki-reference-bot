import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1678007976329 implements MigrationInterface {
    name = 'schema1678007976329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "speech"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "speech" ("id" SERIAL NOT NULL, "name" text, CONSTRAINT "PK_843ce3ca493a7e53e761a16e435" PRIMARY KEY ("id"))`);
    }

}
