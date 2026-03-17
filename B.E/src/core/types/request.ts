import { Request as ExpressRequest } from "express"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
