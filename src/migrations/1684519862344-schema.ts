import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1684519862344 implements MigrationInterface {
    name = 'schema1684519862344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userId" integer NOT NULL`);
    }

}
