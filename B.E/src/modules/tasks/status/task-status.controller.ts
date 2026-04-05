import { Response, NextFunction } from "express"
import service from "./task-status.service"
import { sendResponse } from "@core/utils/response"
import { ChangeTaskStatusDto } from "./dto/task-status.dto"
import { Request } from "@core/types/request"
import ApiError from "@core/utils/apiError"

export default {
    async changeStatus(req: Request<ChangeTaskStatusDto>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const dto = req.dto!
            const userId = req.user!.userId
            const result = await service.changeStatus(id as string, dto, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 201, "Cập nhật trạng thái thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const result = await service.getHistory(id as string)
            return sendResponse(res, 200, "Lấy lịch sử trạng thái thành công", result)
        } catch (error) {
            next(error)
        }
    },
}
