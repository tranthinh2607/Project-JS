import { Response, NextFunction } from "express"
import service from "./checklist.service"
import { sendResponse } from "@core/utils/response"
import { CreateChecklistItemDto, ToggleChecklistItemDto } from "./dto/checklist.dto"
import { Request } from "@core/types/request"
import ApiError from "@core/utils/apiError"

export default {
    async addItem(req: Request<CreateChecklistItemDto>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const dto = req.dto!
            const userId = req.user!.userId
            const result = await service.addItem(id as string, dto, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }
            return sendResponse(res, 201, "Thêm checklist thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getItems(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const result = await service.getItems(id as string)
            return sendResponse(res, 200, "Lấy danh sách checklist thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async toggleItem(req: Request<ToggleChecklistItemDto>, res: Response, next: NextFunction) {
        try {
            const { itemId } = req.params
            const dto = req.dto!
            const userId = req.user!.userId
            const result = await service.toggleItem(itemId as string, dto, userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }
            return sendResponse(res, 200, "Cập nhật checklist thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async deleteItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { itemId } = req.params
            const result = await service.deleteItem(itemId as string)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }
            return sendResponse(res, 200, "Xóa checklist thành công", result)
        } catch (error) {
            next(error)
        }
    }
}
