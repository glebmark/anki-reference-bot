import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1678007088798 implements MigrationInterface {
    name = 'schema1678007088798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "example" ("id" SERIAL NOT NULL, "definitionId" integer NOT NULL, "example" text, CONSTRAINT "PK_608dd5fd6f0783062b07346ed1c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "definition" ("id" SERIAL NOT NULL, "titleId" integer NOT NULL, "definition" text, CONSTRAINT "PK_5eb37954eebae17387f4ebabb5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "title" ADD "title" text`);
        await queryRunner.query(`ALTER TABLE "title" ADD CONSTRAINT "UQ_cb65b3a8b17aa5e021346909522" UNIQUE ("title")`);
        await queryRunner.query(`CREATE TYPE "public"."language_type_enum" AS ENUM('eng', 'fr')`);
        await queryRunner.query(`ALTER TABLE "title" ADD "languageType" "public"."language_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "title" ADD "transcription" text`);
        await queryRunner.query(`ALTER TABLE "title" ADD "partOfSpeech" text`);
        await queryRunner.query(`ALTER TABLE "example" ADD CONSTRAINT "FK_d8b0169cdce0e52dac3ae52e291" FOREIGN KEY ("definitionId") REFERENCES "definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "definition" ADD CONSTRAINT "FK_53eba6c0438e02d7ad390dace16" FOREIGN KEY ("titleId") REFERENCES "title"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "definition" DROP CONSTRAINT "FK_53eba6c0438e02d7ad390dace16"`);
        await queryRunner.query(`ALTER TABLE "example" DROP CONSTRAINT "FK_d8b0169cdce0e52dac3ae52e291"`);
        await queryRunner.query(`ALTER TABLE "title" DROP COLUMN "partOfSpeech"`);
        await queryRunner.query(`ALTER TABLE "title" DROP COLUMN "transcription"`);
        await queryRunner.query(`ALTER TABLE "title" DROP COLUMN "languageType"`);
        await queryRunner.query(`DROP TYPE "public"."language_type_enum"`);
        await queryRunner.query(`ALTER TABLE "title" DROP CONSTRAINT "UQ_cb65b3a8b17aa5e021346909522"`);
        await queryRunner.query(`ALTER TABLE "title" DROP COLUMN "title"`);
        await queryRunner.query(`DROP TABLE "definition"`);
        await queryRunner.query(`DROP TABLE "example"`);
    }

}
