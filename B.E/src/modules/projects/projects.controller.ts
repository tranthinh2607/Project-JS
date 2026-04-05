import { Response, NextFunction } from "express"
import service from "./projects.service"
import { sendResponse } from "@core/utils/response"
import { CreateProjectDto, UpdateProjectDto } from "./dto/projects.dto"
import { Request } from "@core/types/request"
import ApiError from "@core/utils/apiError"

export default {
    async create(req: Request<CreateProjectDto>, res: Response, next: NextFunction) {
        try {
            const dto = req.dto!
            const userId = req.user!.userId
            const result = await service.create(dto, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 201, "Tạo dự án thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getMyProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const keyword = req.query.keyword as string

            const result = await service.getMyProjects(userId, page, limit, keyword)

            return sendResponse(res, 200, "Lấy danh sách dự án thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const result = await service.getById(id as string)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Lấy thông tin dự án thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async update(req: Request<UpdateProjectDto>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const dto = req.dto!
            const userId = req.user!.userId
            const result = await service.update(id as string, dto, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Cập nhật dự án thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const userId = req.user!.userId
            const result = await service.delete(id as string, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Xóa dự án thành công", result)
        } catch (error) {
            next(error)
        }
    }
}
