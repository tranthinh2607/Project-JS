import { FieldError } from "../types/error.type"

export default class ApiError extends Error {

    status: number
    errors?: FieldError[]

    constructor(
        status: number,
        message: string,
        field?: string,
        messages?: string[],
        errors?: FieldError[]
    ) {
        super(message)

        this.status = status

        if (field && messages) {
            this.errors = [{ field, messages }]
        } else if (errors) {
            this.errors = errors
        }
    }
}