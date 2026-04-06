import { Router } from "express"
import authMiddleware from "@core/middlewares/auth.middleware"
import dashboardController from "./dashboard.controller"

const router = Router()

router.get("/", authMiddleware, dashboardController.getStats)

export default router
