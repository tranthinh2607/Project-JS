import { Response, NextFunction } from "express"
import service from "./tasks.service"
import { sendResponse } from "@core/utils/response"
import { CreateTaskDto, UpdateTaskDto } from "./dto/tasks.dto"
import { Request } from "@core/types/request"
import ApiError from "@core/utils/apiError"

export default {
    async createTask(req: Request<CreateTaskDto>, res: Response, next: NextFunction) {
        try {
            const dto = req.dto!
            const userId = req.user!.userId
            const result = await service.createTask(dto, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 201, "Tạo task thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getTasksByProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params
            const { keyword, priority } = req.query
            const result = await service.getTasksByProject(
                projectId as string, 
                keyword as string, 
                priority as string
            )
            return sendResponse(res, 200, "Lấy danh sách task thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getTaskDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const result = await service.getTaskDetail(id as string)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Lấy chi tiết task thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async updateTask(req: Request<UpdateTaskDto>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const dto = req.dto!
            const userId = req.user!.userId
            const result = await service.updateTask(id as string, dto, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Cập nhật task thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const userId = req.user!.userId
            const result = await service.deleteTask(id as string, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Xóa task thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getTasks(req: Request<any>, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId
            const query = req.query
            const result = await service.getTasks(userId, query)
            return sendResponse(res, 200, "Lấy danh sách task thành công", result)
        } catch (error) {
            next(error)
        }
    },
}
