import { CreateProjectDto, UpdateProjectDto } from "./dto/projects.dto"
import { ProjectMemberRole } from "@modules/project-members/project-members.model"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"
import repo from "./projects.repository"
import memberRepo from "@modules/project-members/project-members.repository"

export default {
    async create(dto: CreateProjectDto, owner_id: string) {
        const project = await repo.create({ ...dto, owner_id })
        
        // Also create an owner entry in project_members
        await memberRepo.create({
            project_id: project._id,
            user_id: new mongoose.Types.ObjectId(owner_id) as any,
            role: ProjectMemberRole.OWNER
        })

        return { data: project }
    },

    async getById(id: string) {
        const project = await repo.findById(id)
        if (!project) {
            return new ApiError(404, "Không tìm thấy dự án")
        }
        return { data: project }
    },

    async getMyProjects(userId: string) {
        const projects = await memberRepo.getUserProjects(userId)
        return { data: projects }
    },

    async update(id: string, dto: UpdateProjectDto, userId: string) {
        const project = await repo.findById(id)
        if (!project) {
            return new ApiError(404, "Không tìm thấy dự án")
        }

        if (project.owner_id.toString() !== userId) {
            return new ApiError(403, "Bạn không có quyền chỉnh sửa dự án này")
        }

        const updatedProject = await repo.update(id, dto)
        return { data: updatedProject }
    },

    async delete(id: string, userId: string) {
        const project = await repo.findById(id)
        if (!project) {
            return new ApiError(404, "Không tìm thấy dự án")
        }

        if (project.owner_id.toString() !== userId) {
            return new ApiError(403, "Bạn không có quyền xóa dự án này")
        }

        await repo.delete(id)
        // Also delete all members of the project?
        // For now, let's just delete the project. 
        // In a real app, we might want to cascade or keep them as orphaned.
        return { data: null }
    }
}
