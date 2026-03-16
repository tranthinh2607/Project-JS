import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class Init1773418076174 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tbl_customers",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "20",
                        comment: "INDIVIDUAL | COMPANY",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "20",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "address",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "tax_code",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "company_name",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "note",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
        );

        await queryRunner.createIndex(
            "tbl_customers",
            new TableIndex({
                name: "IDX_CUSTOMER_PHONE",
                columnNames: ["phone"],
            }),
        );

        await queryRunner.createIndex(
            "tbl_customers",
            new TableIndex({
                name: "IDX_CUSTOMER_TAX_CODE",
                columnNames: ["tax_code"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("tbl_customers");
    }
}