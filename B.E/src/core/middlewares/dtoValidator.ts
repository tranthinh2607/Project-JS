import { Response, NextFunction } from "express"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import ApiError from "../utils/apiError"
import { Request } from "@core/types/request"

export default function validateDTO(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {

        const dto = plainToInstance(dtoClass, req.body, {
            enableImplicitConversion: true
        })

        const errors = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true
        })

        if (errors.length > 0) {
            const formattedErrors = errors.map(e => {

                const messages = Object.entries(e.constraints || {}).map(([key, value]) => {

                    if (key === "whitelistValidation") {
                        return `Trường ${e.property} không được phép tồn tại`
                    }

                    return value
                })

                return {
                    field: e.property,
                    messages
                }
            })

            return next(
                new ApiError(
                    400,
                    "Dữ liệu không hợp lệ",
                    undefined,
                    undefined,
                    formattedErrors
                )
            )
        }

        // Attach validated DTO to request
        req.dto = dto
        next()
    }
}