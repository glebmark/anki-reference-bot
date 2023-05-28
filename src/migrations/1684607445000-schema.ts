import { MigrationInterface, QueryRunner } from "typeorm";

export class schema1684607445000 implements MigrationInterface {
    name = 'schema1684607445000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "user" DEFAULT VALUES;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
