import { Router } from "express"
import controller from "./tasks.controller"
import statusController from "./status/task-status.controller"
import assigneeController from "./assignees/task-assignee.controller"
import checklistController from "./checklists/checklist.controller"
import validateDTO from "@core/middlewares/dtoValidator"
import { CreateTaskDto, UpdateTaskDto, GetTasksDto } from "./dto/tasks.dto"
import { ChangeTaskStatusDto } from "./status/dto/task-status.dto"
import { CreateChecklistItemDto, ToggleChecklistItemDto } from "./checklists/dto/checklist.dto"
import authMiddleware from "@core/middlewares/auth.middleware"

const router = Router()

router.use(authMiddleware as any)

router.get("/", validateDTO(GetTasksDto, "query"), controller.getTasks)
router.post("/", validateDTO(CreateTaskDto), controller.createTask)
router.get("/project/:projectId", controller.getTasksByProject)
router.get("/:id", controller.getTaskDetail)
router.patch("/:id", validateDTO(UpdateTaskDto), controller.updateTask)
router.delete("/:id", controller.deleteTask)

router.post("/:id/status", validateDTO(ChangeTaskStatusDto), statusController.changeStatus)
router.get("/:id/status-history", statusController.getHistory)

router.post("/:id/assign", assigneeController.assignUser)
router.delete("/:id/assign/:userId", assigneeController.unassignUser)

// Checklist routes
router.post("/:id/checklists", validateDTO(CreateChecklistItemDto), checklistController.addItem)
router.get("/:id/checklists", checklistController.getItems)
router.patch("/:id/checklists/:itemId", validateDTO(ToggleChecklistItemDto), checklistController.toggleItem)
router.delete("/:id/checklists/:itemId", checklistController.deleteItem)

export default router
