import mongoose from "mongoose"
import { env } from "@core/config/env.config"

export const connectMongo = async () => {
    await mongoose.connect(env.db.mongoUri)
    console.log("Connected to MongoDB")
}

export default mongoose