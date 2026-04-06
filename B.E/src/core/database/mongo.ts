import mongoose from "mongoose"
import { env } from "@core/config/env.config"
import logger from "@core/utils/logger"

export const connectMongo = async () => {
    await mongoose.connect(env.db.mongoUri as string)
    logger.info("Connected to MongoDB")
}

export default mongoose