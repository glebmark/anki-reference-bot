import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1673118688810 implements MigrationInterface {
    name = 'schema1673118688810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "title" ("id" SERIAL NOT NULL, CONSTRAINT "PK_30e6ea2dcc2aae4a4d1f5d9e183" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "title_user_progress" ("userId" integer NOT NULL, "titleId" integer NOT NULL, "isSavedToAnki" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d28d98f4713b3310801f6408e2c" PRIMARY KEY ("userId", "titleId"))`);
        await queryRunner.query(`CREATE TABLE "speech" ("id" SERIAL NOT NULL, "name" text, CONSTRAINT "PK_843ce3ca493a7e53e761a16e435" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "title_user_progress" ADD CONSTRAINT "FK_1255f2d04538f43b7c63252f0ff" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "title_user_progress" ADD CONSTRAINT "FK_a1281608559160bbaf589402855" FOREIGN KEY ("titleId") REFERENCES "title"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "title_user_progress" DROP CONSTRAINT "FK_a1281608559160bbaf589402855"`);
        await queryRunner.query(`ALTER TABLE "title_user_progress" DROP CONSTRAINT "FK_1255f2d04538f43b7c63252f0ff"`);
        await queryRunner.query(`DROP TABLE "speech"`);
        await queryRunner.query(`DROP TABLE "title_user_progress"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "title"`);
    }

}
