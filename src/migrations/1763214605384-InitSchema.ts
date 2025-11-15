import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1763214605384 implements MigrationInterface {
    name = 'InitSchema1763214605384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "facilities"`);
        await queryRunner.query(`ALTER TABLE "place" ADD "facilities" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "facilities"`);
        await queryRunner.query(`ALTER TABLE "place" ADD "facilities" character varying NOT NULL`);
    }

}
