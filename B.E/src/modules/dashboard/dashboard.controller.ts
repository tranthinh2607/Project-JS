import { Response, NextFunction } from "express"
import { sendResponse } from "@core/utils/response"
import { Request } from "@core/types/request"
import dashboardService from "./dashboard.service"

export default {
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId
            if (!userId) {
                return sendResponse(res, 401, "Unauthorized", null, [{ field: "authorization", messages: ["Vui lòng đăng nhập"] }])
            }

            const { startDate, endDate } = req.query

            const result = await dashboardService.getStats(
                userId,
                startDate as string | undefined,
                endDate as string | undefined
            )

            // Note: service returns { status, message, data } directly
            return sendResponse(res, 200, "Lấy thống kê thành công", result)
        } catch (error) {
            next(error)
        }
    }
}
