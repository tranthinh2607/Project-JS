import { Response } from "express"
import { FieldError } from "../types/error.type"

export function sendResponse(
    res: Response,
    status: number,
    message: string,
    data?: any,
    errors?: FieldError[]
) {

    return res.status(status).json({
        status,
        message,
        ...data,
        errors: errors ?? []
    })

}