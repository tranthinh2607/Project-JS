import mysql from "mysql2/promise"
import logger from "@core/utils/logger"
import { env } from "@core/config/env.config"

const pool = mysql.createPool({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    connectionLimit: 10
})
logger.info(`MySQL connected to ${env.db.host}:${env.db.port}/${env.db.name}`)

export default pool