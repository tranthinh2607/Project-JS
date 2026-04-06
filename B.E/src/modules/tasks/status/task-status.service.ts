import repo from "./task-status.repository"
import taskRepo from "../tasks.repository"
import { ChangeTaskStatusDto } from "./dto/task-status.dto"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"
import projectRepo from "@modules/projects/projects.repository"
import memberRepo from "@modules/project-members/project-members.repository"
import { User } from "@modules/auth/auth.model"
import { TaskStatusEnum } from "./task-status.model"

export default {
    async changeStatus(taskId: string, dto: ChangeTaskStatusDto, userId: string) {
        const task = await taskRepo.findById(taskId)
        if (!task) {
            return new ApiError(404, "Không tìm thấy công việc")
        }

        // Verify user is a project member
        const user = await User.findById(userId)
        if (!user) {
            return new ApiError(404, "Không tìm thấy người dùng")
        }
        const isMember = await memberRepo.findByProjectAndEmail(task.project_id.toString(), user.email)
        if (!isMember) {
            return new ApiError(403, "Bạn không phải thành viên dự án này")
        }

        // Rule quan trọng: blocked -> bắt buộc có note
        if (dto.status === TaskStatusEnum.BLOCKED && !dto.note) {
            return new ApiError(400, "Khi chuyển sang trạng thái bị chặn, bạn phải nhập lý do")
        }

        const statusDoc = await repo.create({
            task_id: new mongoose.Types.ObjectId(taskId) as any,
            status: dto.status,
            note: dto.note,
            changed_by: new mongoose.Types.ObjectId(userId) as any,
        })

        return { data: statusDoc }
    },

    async getHistory(taskId: string) {
        const history = await repo.getStatusHistory(taskId)
        return { data: history }
    }
}
