import { Router } from "express"
import controller from "./project-members.controller"
import validateDTO from "@core/middlewares/dtoValidator"
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "./dto/project-members.dto"
import authMiddleware from "@core/middlewares/auth.middleware"

const router = Router()

router.use(authMiddleware as any)

router.post("/", validateDTO(CreateProjectMemberDto), controller.addMember)
router.get("/project/:projectId", controller.getProjectMembers)
router.patch("/:id", validateDTO(UpdateProjectMemberDto), controller.updateMemberRole)
router.delete("/:id", controller.removeMember)

export default router
