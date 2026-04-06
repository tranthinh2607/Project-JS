import { Response, NextFunction } from "express"
import { AuthRequest } from "./auth.middleware"

export default function requirePermission(_requiredPermissionKey: string) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        next()
    }
}
