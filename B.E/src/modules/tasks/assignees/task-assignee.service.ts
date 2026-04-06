import repo from "./task-assignee.repository"
import taskRepo from "../tasks.repository"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"
import memberRepo from "@modules/project-members/project-members.repository"
import { User } from "@modules/auth/auth.model"

export default {
    async assignUser(taskId: string, dto: any, userId: string) {
        const task = await taskRepo.findById(taskId)
        if (!task) {
            return new ApiError(404, "Không tìm thấy công việc")
        }

        const userIds = dto.user_ids || (dto.user_id ? [dto.user_id] : [])
        if (userIds.length === 0) {
            return new ApiError(400, "Vui lòng cung cấp ít nhất một người dùng")
        }

        const assignments = []
        for (const targetUserId of userIds) {
            // Verify target user exists
            const targetUser = await User.findById(targetUserId)
            if (!targetUser) continue

            // Verify target user is a project member
            const isMember = await memberRepo.findByProjectAndEmail(task.project_id.toString(), targetUser.email)
            if (!isMember) continue

            // Check if already assigned
            try {
                const assignment = await repo.create({
                    task_id: new mongoose.Types.ObjectId(taskId) as any,
                    user_id: new mongoose.Types.ObjectId(targetUserId) as any,
                    assigned_by: new mongoose.Types.ObjectId(userId) as any,
                })
                assignments.push(assignment)
            } catch (error: any) {
                if (error.code !== 11000) {
                    throw error
                }
                // Skip if already assigned
            }
        }

        return { data: assignments }
    },

    async unassignUser(taskId: string, targetUserId: string, userId: string) {
        // Logic check permissions can be added here if needed
        await repo.delete(taskId, targetUserId)
        return { data: null }
    }
}
