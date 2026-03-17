import { Response } from "express"
import { FieldError } from "../types/error.type"

export function sendResponse(
    res: Response,
    status: number,
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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