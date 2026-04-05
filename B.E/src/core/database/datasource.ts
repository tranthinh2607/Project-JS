import "reflect-metadata"
import { DataSource } from "typeorm"
import { env } from "@core/config/env.config"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.db.host,
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
    database: env.db.name,

    synchronize: false,
    logging: false,

    entities: [],
    migrations: ["src/core/database/migration/*.ts"]
})