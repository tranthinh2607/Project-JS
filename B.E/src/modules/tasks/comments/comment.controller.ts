import { Request, Response, NextFunction } from "express"
import service from "./comment.service"
import { sendResponse } from "@core/utils/response"
import ApiError from "@core/utils/apiError"

export default {
    async addComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: taskId } = req.params as any
            const { content } = req.body
            const userId = (req as any).user?.userId

            const result = await service.addComment(taskId, userId!, content)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 201, "Đã thêm bình luận", result.data)
        } catch (error) {
            next(error)
        }
    },

    async getComments(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: taskId } = req.params as any
            const result = await service.getComments(taskId)
            return sendResponse(res, 200, "Lấy danh sách bình luận thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { commentId } = req.params as any
            const userId = (req as any).user?.userId
            const result = await service.deleteComment(commentId, userId!)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Đã xóa bình luận", null)
        } catch (error) {
            next(error)
        }
    }
}
