import { Router } from "express"
import controller from "./projects.controller"
import validateDTO from "@core/middlewares/dtoValidator"
import { CreateProjectDto, UpdateProjectDto } from "./dto/projects.dto"
import authMiddleware from "@core/middlewares/auth.middleware"

const router = Router()

router.use(authMiddleware)

router.post("/", validateDTO(CreateProjectDto), controller.create)
router.get("/my", controller.getMyProjects)
router.get("/:id", controller.getById)
router.patch("/:id", validateDTO(UpdateProjectDto), controller.update)
router.delete("/:id", controller.delete)

export default router
