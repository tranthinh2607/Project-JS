import express from "express"
import cors from "cors"
import moduleLoader from "@core/loaders/moduleLoader"
import errorMiddleware from "@core/middlewares/error.middleware"
import requestLogger from "@core/middlewares/requestLogger"

import path from "path"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

app.use(requestLogger)

moduleLoader(app)

app.use(errorMiddleware)

export default app