import repo from "./task-assignee.repository"
import taskRepo from "../tasks.repository"
import { AssignTaskDto } from "./dto/task-assignee.dto"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"
import memberRepo from "@modules/project-members/project-members.repository"
import { User } from "@modules/auth/auth.model"

export default {
    async assignUser(taskId: string, dto: AssignTaskDto, userId: string) {
        const task = await taskRepo.findById(taskId)
        if (!task) {
            return new ApiError(404, "Không tìm thấy công việc")
        }

        // Verify target user exists
        const targetUser = await User.findById(dto.user_id)
        if (!targetUser) {
            return new ApiError(404, "Không tìm thấy người dùng được chỉ định")
        }

        // Verify target user is a project member
        const isMember = await memberRepo.findByProjectAndEmail(task.project_id.toString(), targetUser.email)
        if (!isMember) {
            return new ApiError(400, "Người dùng được chỉ định không phải thành viên dự án này")
        }

        // Check if already assigned
        try {
            const assignment = await repo.create({
                task_id: new mongoose.Types.ObjectId(taskId) as any,
                user_id: new mongoose.Types.ObjectId(dto.user_id) as any,
                assigned_by: new mongoose.Types.ObjectId(userId) as any,
            })
            return { data: assignment }
        } catch (error: any) {
            if (error.code === 11000) {
                return new ApiError(400, "Người dùng này đã được chỉ định cho công việc này")
            }
            throw error
        }
    },

    async unassignUser(taskId: string, targetUserId: string, userId: string) {
        // Logic check permissions can be added here if needed
        await repo.delete(taskId, targetUserId)
        return { data: null }
    }
}
