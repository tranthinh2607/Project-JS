import { Request, Response, NextFunction } from "express"
import ApiError from "../utils/apiError"
import logger from "../utils/logger"

export default function errorMiddleware(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) {

    if (err instanceof ApiError) {

        return res.status(err.status).json({
            status: err.status,
            message: err.message,
            data: null,
            errors: err.errors ?? []
        })

    }

    logger.error(err.message)

    return res.status(500).json({
        status: 500,
        message: "Lỗi server",
        data: null,
        errors: []
    })

}