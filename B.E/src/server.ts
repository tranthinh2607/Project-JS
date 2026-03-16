import "reflect-metadata"
import "dotenv/config"
import app from "./app"
import { env } from "@core/config/env.config"
import logger from "@core/utils/logger"
import { connectMongo } from "@core/database/mongo"

const PORT = env.port

async function startServer() {
    try {
        await connectMongo()
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`)
        })
    } catch (error) {
        logger.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()