import { Request as ExpressRequest } from "express"

export interface Request<T = any> extends ExpressRequest {
    dto?: T
    id?: number
    user?: {
        userId: string
        username: string
        email: string
        roles: string[]
    }
}
