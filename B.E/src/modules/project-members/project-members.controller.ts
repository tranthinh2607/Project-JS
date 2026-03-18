import { Response, NextFunction } from "express"
import service from "./project-members.service"
import { sendResponse } from "@core/utils/response"
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "./dto/project-members.dto"
import { Request } from "@core/types/request"
import ApiError from "@core/utils/apiError"

export default {
    async addMember(req: Request<CreateProjectMemberDto>, res: Response, next: NextFunction) {
        try {
            const dto = req.dto!
            const currentUserId = req.user!.userId
            const result = await service.addMember(dto, currentUserId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 201, "Thêm thành viên thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async getProjectMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params
            const result = await service.getProjectMembers(projectId as string)

            return sendResponse(res, 200, "Lấy danh sách thành viên thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async updateMemberRole(req: Request<UpdateProjectMemberDto>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const dto = req.dto!
            const currentUserId = req.user!.userId
            const result = await service.updateMemberRole(id as string, dto, currentUserId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Cập nhật vai trò thành công", result)
        } catch (error) {
            next(error)
        }
    },

    async removeMember(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const currentUserId = req.user!.userId
            const result = await service.removeMember(id as string, currentUserId)

            if (result instanceof ApiError) {
                return sendResponse(res, result.status, result.message, null, result.errors)
            }

            return sendResponse(res, 200, "Xóa thành viên thành công", result)
        } catch (error) {
            next(error)
        }
    }
}
