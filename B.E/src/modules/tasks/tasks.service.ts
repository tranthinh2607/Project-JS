import repo from "./tasks.repository"
import { CreateTaskDto, UpdateTaskDto } from "./dto/tasks.dto"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"
import { Task } from "./tasks.model"
import projectRepo from "@modules/projects/projects.repository"
import memberRepo from "@modules/project-members/project-members.repository"
import { User } from "@modules/auth/auth.model"

export default {
    async createTask(dto: CreateTaskDto, userId: string) {
        // Verify project exists
        const project = await projectRepo.findById(dto.project_id)
        if (!project) {
            return new ApiError(404, "Không tìm thấy dự án")
        }

        // Verify user is a project member
        const user = await User.findById(userId)
        if (!user) {
            return new ApiError(404, "Không tìm thấy người dùng")
        }
        const isMember = await memberRepo.findByProjectAndEmail(dto.project_id, user.email)
        if (!isMember) {
            return new ApiError(403, "Bạn không phải thành viên dự án này")
        }

        // Validate subtask depth (max 1 level)
        if (dto.parent_task_id) {
            const parent = await Task.findById(dto.parent_task_id).lean()
            if (!parent) {
                return new ApiError(404, "Không tìm thấy task cha")
            }
            if (parent.parent_task_id) {
                return new ApiError(400, "Không được phép tạo subtask quá 1 cấp")
            }
            // Ensure parent belongs to the same project
            if (parent.project_id.toString() !== dto.project_id) {
                return new ApiError(400, "Task cha không thuộc cùng dự án")
            }
        }

        const task = await repo.create({
            project_id: new mongoose.Types.ObjectId(dto.project_id) as any,
            parent_task_id: dto.parent_task_id
                ? (new mongoose.Types.ObjectId(dto.parent_task_id) as any)
                : null,
            title: dto.title,
            description: dto.description,
            priority: dto.priority,
            start_date: dto.start_date ? new Date(dto.start_date) : undefined,
            due_date: dto.due_date ? new Date(dto.due_date) : undefined,
            created_by: new mongoose.Types.ObjectId(userId) as any,
        })

        return { data: task }
    },

    async getTasksByProject(projectId: string, keyword?: string, priority?: string) {
        const tasks = await repo.findByProject(projectId, keyword, priority)
        return { data: tasks }
    },

    async getTaskDetail(taskId: string) {
        const task = await repo.findWithDetail(taskId)
        if (!task) {
            return new ApiError(404, "Không tìm thấy task")
        }

        const subtasks = await repo.findSubtasks(taskId)
        return { data: { ...task, subtasks } }
    },

    async updateTask(taskId: string, dto: UpdateTaskDto, userId: string) {
        const task = await Task.findById(taskId).lean()
        if (!task) {
            return new ApiError(404, "Không tìm thấy task")
        }

        const updatedTask = await repo.update(taskId, {
            ...dto,
            start_date: dto.start_date ? new Date(dto.start_date) : undefined,
            due_date: dto.due_date ? new Date(dto.due_date) : undefined,
            updated_by: new mongoose.Types.ObjectId(userId) as any,
        })

        return { data: updatedTask }
    },

    async deleteTask(taskId: string, userId: string) {
        const task = await Task.findById(taskId).lean()
        if (!task) {
            return new ApiError(404, "Không tìm thấy task")
        }

        // Only creator or project owner can delete
        const project = await projectRepo.findById(task.project_id.toString())
        const isOwner = project?.owner_id.toString() === userId
        const isCreator = task.created_by.toString() === userId

        if (!isOwner && !isCreator) {
            return new ApiError(403, "Bạn không có quyền xóa task này")
        }

        await repo.deleteWithSubtasks(taskId)
        return { data: null }
    }
}
