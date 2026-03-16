import { MigrationInterface, QueryRunner, } from "typeorm";

export class Init1773421283551 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE tbl_customers
            MODIFY COLUMN id INT UNSIGNED NOT NULL AUTO_INCREMENT
        `)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE tbl_customers
            MODIFY COLUMN id VARCHAR(36) NOT NULL
        `)

    }

}
