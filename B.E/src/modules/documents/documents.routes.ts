import { Router } from "express"
import controller from "./documents.controller"
import authMiddleware from "@core/middlewares/auth.middleware"
import { uploadDocument } from "@core/utils/upload"

const router = Router()

router.post("/upload", authMiddleware, uploadDocument.single("file"), controller.upload)
router.get("/project/:projectId", authMiddleware, controller.getByProject)
router.delete("/:id", authMiddleware, controller.delete)

export default router
