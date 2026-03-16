import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class Init1773421904628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "tbl_vehicles",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "customer_id",
                        type: "int",
                        unsigned: true
                    },
                    {
                        name: "plate_number",
                        type: "varchar",
                        length: "20"
                    },
                    {
                        name: "brand",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "model",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "year",
                        type: "int",
                        isNullable: true
                    },
                    {
                        name: "color",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "vin",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "note",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            })
        )

        await queryRunner.createIndex(
            "tbl_vehicles",
            new TableIndex({
                name: "IDX_VEHICLE_PLATE",
                columnNames: ["plate_number"]
            })
        )

        await queryRunner.createIndex(
            "tbl_vehicles",
            new TableIndex({
                name: "IDX_VEHICLE_CUSTOMER",
                columnNames: ["customer_id"]
            })
        )

        await queryRunner.createForeignKey(
            "tbl_vehicles",
            new TableForeignKey({
                columnNames: ["customer_id"],
                referencedTableName: "tbl_customers",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("tbl_vehicles")
    }

}
