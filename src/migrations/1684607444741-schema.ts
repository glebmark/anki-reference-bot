import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1684607444741 implements MigrationInterface {
    name = 'schema1684607444741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "filePath"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ADD "filePath" text`);
    }

}
