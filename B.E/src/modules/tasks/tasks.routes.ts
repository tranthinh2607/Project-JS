import { Router } from "express"
import controller from "./tasks.controller"
import statusController from "./status/task-status.controller"
import validateDTO from "@core/middlewares/dtoValidator"
import { CreateTaskDto, UpdateTaskDto } from "./dto/tasks.dto"
import { ChangeTaskStatusDto } from "./status/dto/task-status.dto"
import { AssignTaskDto } from "./assignees/dto/task-assignee.dto"
import authMiddleware from "@core/middlewares/auth.middleware"
import assigneeController from "./assignees/task-assignee.controller"

const router = Router()

router.use(authMiddleware as any)

router.post("/", validateDTO(CreateTaskDto), controller.createTask)
router.get("/project/:projectId", controller.getTasksByProject)
router.get("/:id", controller.getTaskDetail)
router.patch("/:id", validateDTO(UpdateTaskDto), controller.updateTask)
router.delete("/:id", controller.deleteTask)

router.post("/:id/status", validateDTO(ChangeTaskStatusDto), statusController.changeStatus)
router.get("/:id/status-history", statusController.getHistory)

router.post("/:id/assign", validateDTO(AssignTaskDto), assigneeController.assignUser)
router.delete("/:id/assign/:userId", assigneeController.unassignUser)


export default router
