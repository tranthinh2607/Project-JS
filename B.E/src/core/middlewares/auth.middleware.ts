import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import ApiError from "../utils/apiError"
import { env } from "../config/env.config"

export interface AuthRequest extends Request {
    user?: {
        userId: string
        username: string
        email: string
        roles: string[]
    }
}

interface JwtPayload {
    userId: string
    username: string
    email: string
    roles: string[]
    type?: string
    iat?: number
    exp?: number
}

export default function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(
            new ApiError(401, "Không được phép truy cập", "authorization", ["Vui lòng đăng nhập để tiếp tục"])
        )
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            roles: decoded.roles || [],
        } as AuthRequest["user"]
        next()
    } catch {
        return next(
            new ApiError(401, "Token không hợp lệ", "authorization", ["Token đã hết hạn hoặc không hợp lệ"])
        )
    }
}
