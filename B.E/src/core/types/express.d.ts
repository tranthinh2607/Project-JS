import "express"

declare global {
    namespace Express {
        interface Request {
            dto?: any
            id?: number
        }
    }
}

export { }