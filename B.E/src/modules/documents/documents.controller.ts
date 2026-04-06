import { Request, Response, NextFunction } from "express"
import service from "./documents.service"
import { sendResponse } from "@core/utils/response"
import ApiError from "@core/utils/apiError"

export default {
    async upload(req: Request, res: Response, next: NextFunction) {
        try {
            const { project_id } = req.body
            const userId = (req as any).user?.userId

            if (!project_id) {
                return sendResponse(res, 400, "Project ID is required")
            }

            if (!req.file) {
                return sendResponse(res, 400, "File is required")
            }

            const result = await service.uploadDocument(project_id, userId!, req.file)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 201, "Tải lên tài liệu thành công", result.data)
        } catch (error) {
            next(error)
        }
    },

    async getByProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params as any
            const result = await service.getDocuments(projectId, req.query)
            return sendResponse(res, 200, "Lấy danh sách tài liệu thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as any
            const userId = (req as any).user?.userId
            const result = await service.deleteDocument(id, userId!)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Xóa tài liệu thành công", null)
        } catch (error) {
            next(error)
        }
    }
}
