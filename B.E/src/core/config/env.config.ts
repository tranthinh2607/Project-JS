import dotenv from "dotenv"
dotenv.config()

export const env = {
    port: Number(process.env.PORT) || 3000,

    db: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        name: process.env.DB_NAME!,
        mongoUri: process.env.MONGO_URI,
    },

    jwt: {
        secret: process.env.JWT_SECRET!,
        expire_refresh: process.env.JWT_EXPIRE_REFRESH,
        expire_access: process.env.JWT_EXPIRE_ACCESS,

    }
}