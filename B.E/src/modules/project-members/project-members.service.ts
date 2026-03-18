import repo from "./project-members.repository"
import projectRepo from "../projects/projects.repository"
import ApiError from "@core/utils/apiError"
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "./dto/project-members.dto"
import mongoose from "mongoose"

export default {
    async addMember(dto: CreateProjectMemberDto, currentUserId: string) {
        // Check if project exists
        const project = await projectRepo.findById(dto.project_id)
        if (!project) {
            return new ApiError(404, "Không tìm thấy dự án")
        }

        // Check if current user is owner of the project
        if (project.owner_id.toString() !== currentUserId) {
            return new ApiError(403, "Chỉ chủ sở hữu mới có quyền thêm thành viên")
        }

        // Check if user is already a member
        const existingMember = await repo.findByProjectAndUser(dto.project_id, dto.user_id)
        if (existingMember) {
            return new ApiError(400, "Người dùng đã là thành viên của dự án này")
        }

        const member = await repo.create({
            project_id: new mongoose.Types.ObjectId(dto.project_id) as any,
            user_id: new mongoose.Types.ObjectId(dto.user_id) as any,
            role: dto.role
        })
        return { data: member }
    },

    async getProjectMembers(projectId: string) {
        const members = await repo.findByProject(projectId)
        return { data: members }
    },

    async updateMemberRole(id: string, dto: UpdateProjectMemberDto, currentUserId: string) {
        const member = await repo.findById(id)
        if (!member) {
            return new ApiError(404, "Không tìm thấy thành viên")
        }

        const project = await projectRepo.findById(member.project_id.toString())
        if (!project) {
            return new ApiError(404, "Không tìm thấy dự án")
        }

        if (project.owner_id.toString() !== currentUserId) {
            return new ApiError(403, "Chỉ chủ sở hữu mới có quyền thay đổi vai trò")
        }

        if (member.user_id.toString() === project.owner_id.toString()) {
            return new ApiError(400, "Không thể thay đổi vai trò của chủ sở hữu dự án")
        }

        const updatedMember = await repo.update(id, dto)
        return { data: updatedMember }
    },

    async removeMember(id: string, currentUserId: string) {
        const member = await repo.findById(id)
        if (!member) {
            return new ApiError(404, "Không tìm thấy thành viên")
        }

        const project = await projectRepo.findById(member.project_id.toString())
        if (!project) {
            return new ApiError(404, "Không tìm thấy dự án")
        }

        // Owner can remove anyone except themselves
        // Members can only remove themselves
        if (project.owner_id.toString() !== currentUserId && member.user_id.toString() !== currentUserId) {
            return new ApiError(403, "Bạn không có quyền xóa thành viên này")
        }

        if (member.user_id.toString() === project.owner_id.toString()) {
            return new ApiError(400, "Chủ sở hữu không thể rời khỏi dự án. Hãy xóa dự án nếu muốn.")
        }

        await repo.delete(id)
        return { data: null }
    }
}
