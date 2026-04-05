import { Response, NextFunction } from "express"
import { AuthRequest } from "./auth.middleware"
import ApiError from "../utils/apiError"
import roleService from "../../modules/role/role.service"
import { IPermission } from "../../modules/permission/permission.model"

export default function requirePermission(requiredPermissionKey: string) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId
            if (!userId) {
                return next(
                    new ApiError(401, "Không được phép truy cập", "authorization", ["Vui lòng đăng nhập để tiếp tục"])
                )
            }

            const result = await roleService.getUserPermissions(userId)
            
            if (result instanceof ApiError) {
                return next(result)
            }

            const permissions = (result.data?.permissions || []) as IPermission[]

            const hasPermission = permissions.some(
                (p) => p.key === requiredPermissionKey
            )

            if (!hasPermission) {
                return next(
                    new ApiError(403, "Không có quyền truy cập", "permission", ["Bạn không có quyền thực hiện hành động này"])
                )
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}
