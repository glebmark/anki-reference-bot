import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1678024631404 implements MigrationInterface {
    name = 'schema1678024631404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."file_format_enum" AS ENUM('mp3')`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "fileFormat" "public"."file_format_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "fileFormat"`);
        await queryRunner.query(`DROP TYPE "public"."file_format_enum"`);
    }

}
