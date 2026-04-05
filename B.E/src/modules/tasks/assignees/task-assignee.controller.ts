import { Response, NextFunction } from "express"
import service from "./task-assignee.service"
import { sendResponse } from "@core/utils/response"
import { AssignTaskDto } from "./dto/task-assignee.dto"
import { Request } from "@core/types/request"
import ApiError from "@core/utils/apiError"

export default {
    async assignUser(req: Request<AssignTaskDto>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const dto = req.dto!
            const userId = req.user!.userId
            const result = await service.assignUser(id as string, dto, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 201, "Chỉ định người thực hiện thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async unassignUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, userId: targetUserId } = req.params
            const userId = req.user!.userId
            const result = await service.unassignUser(id as string, targetUserId as string, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Gỡ người thực hiện thành công", result)
        } catch (error) {
            next(error)
        }
    },
}
