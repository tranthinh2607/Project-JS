import "express"

declare global {
    namespace Express {
        interface Request {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dto?: any
            id?: number
        }
    }
}

export { }