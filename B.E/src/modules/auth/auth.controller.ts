import { Response, NextFunction } from "express"
import service from "./auth.service"
import { sendResponse } from "@core/utils/response"
import { RegisterDto, LoginDto } from "./dto/auth.dto"
import { Request } from "@core/types/request"
import ApiError from "@core/utils/apiError"

export default {
    async register(req: Request<RegisterDto>, res: Response, next: NextFunction) {
        try {
            const dto = req.dto!
            const result = await service.register(dto)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 201, "Đăng ký thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async login(req: Request<LoginDto>, res: Response, next: NextFunction) {
        try {
            const dto = req.dto!
            const result = await service.login(dto)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Đăng nhập thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId
            if (!userId) {
                return sendResponse(res, 401, "Unauthorized", null, [{ field: "authorization", messages: ["Vui lòng đăng nhập"] }])
            }

            const result = await service.getProfile(userId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Lấy thông tin profile thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId
            if (!userId) {
                return sendResponse(res, 401, "Unauthorized", null, [{ field: "authorization", messages: ["Vui lòng đăng nhập"] }])
            }

            const dto = req.dto!
            const result = await service.updateProfile(userId, dto)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Cập nhật profile thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId
            if (!userId) {
                return sendResponse(res, 401, "Unauthorized", null, [{ field: "authorization", messages: ["Vui lòng đăng nhập"] }])
            }

            const dto = req.dto!
            const result = await service.changePassword(userId, dto)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Đổi mật khẩu thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                return sendResponse(res, 401, "Unauthorized", null, [{ field: "authorization", messages: ["Vui lòng đăng nhập"] }])
            }

            const result = await service.refreshToken(refreshToken)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Làm mới token thành công", result)
        } catch (error) {
            next(error)
        }
    },
}
