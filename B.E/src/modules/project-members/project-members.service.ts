import repo from "./project-members.repository"
import projectRepo from "../projects/projects.repository"
import ApiError from "@core/utils/apiError"
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "./dto/project-members.dto"
import { User } from "@modules/auth/auth.model"
import { mailService } from "@modules/mail/mail.service"
import mongoose from "mongoose"

export default {
    async addMember(dto: CreateProjectMemberDto, currentUserId: string) {
        // Check if project exists
        const project = await projectRepo.findById(dto.project_id)
        if (!project) {
            return new ApiError(404, "Không tìm thấy dự án")
        }

        // Check if current user is owner of the project
        const inviter = await User.findById(currentUserId)
        if (!inviter) {
            return new ApiError(404, "Không tìm thấy người mời")
        }

        if (project.owner_id.toString() !== currentUserId) {
            return new ApiError(403, "Chỉ chủ sở hữu mới có quyền thêm thành viên")
        }

        // Check if user is already a member
        const existingMember = await repo.findByProjectAndEmail(dto.project_id, dto.email)
        if (existingMember) {
            return new ApiError(400, "Người dùng đã là thành viên của dự án này")
        }

        const member = await repo.create({
            project_id: new mongoose.Types.ObjectId(dto.project_id) as any,
            email: dto.email,
            role: dto.role
        })

        // Send invitation email in background
        const invitedUser = await User.findOne({ email: dto.email })
        mailService.sendProjectInvitation(
            dto.email, 
            project.name, 
            inviter.name, 
            !!invitedUser
        ).catch(err => console.error("Failed to send invitation email:", err))

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

        const owner = await User.findById(project.owner_id)
        if (owner && member.email === owner.email) {
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
        const currentUser = await User.findById(currentUserId)
        if (!currentUser) {
            return new ApiError(404, "Không tìm thấy người dùng hiện tại")
        }

        // Owner can remove anyone except themselves
        // Members can only remove themselves
        if (project.owner_id.toString() !== currentUserId && member.email !== currentUser.email) {
            return new ApiError(403, "Bạn không có quyền xóa thành viên này")
        }

        if (member.email === currentUser.email && project.owner_id.toString() === currentUserId) {
            return new ApiError(400, "Chủ sở hữu không thể rời khỏi dự án. Hãy xóa dự án nếu muốn.")
        }

        await repo.delete(id)
        return { data: null }
    }
}
