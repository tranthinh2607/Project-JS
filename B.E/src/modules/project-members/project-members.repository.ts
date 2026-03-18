import mongoose from "mongoose"
import { IProjectMember, ProjectMember } from "./project-members.model"
import { UpdateProjectMemberDto } from "./dto/project-members.dto"

export default {
    async create(data: Partial<IProjectMember>): Promise<IProjectMember> {
        const member = new ProjectMember(data)
        return await member.save()
    },

    async findById(id: string): Promise<IProjectMember | null> {
        return await ProjectMember.findById(id).exec()
    },

    async findByProject(project_id: string): Promise<IProjectMember[]> {
        return await ProjectMember.find({ project_id }).populate("user_id").exec()
    },

    async findByUser(user_id: string): Promise<IProjectMember[]> {
        return await ProjectMember.find({ user_id }).populate("project_id").exec()
    },

    async findByProjectAndUser(project_id: string, user_id: string): Promise<IProjectMember | null> {
        return await ProjectMember.findOne({ project_id, user_id }).exec()
    },

    async update(id: string, data: UpdateProjectMemberDto): Promise<IProjectMember | null> {
        return await ProjectMember.findByIdAndUpdate(id, data, { new: true }).exec()
    },

    async delete(id: string): Promise<IProjectMember | null> {
        return await ProjectMember.findByIdAndDelete(id).exec()
    },

    async deleteByProjectAndUser(project_id: string, user_id: string): Promise<IProjectMember | null> {
        return await ProjectMember.findOneAndDelete({ project_id, user_id }).exec()
    },

    async getUserProjects(userId: string) {
        return await ProjectMember.aggregate([
            {
                $match: { user_id: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project"
                }
            },
            {
                $unwind: "$project"
            },
            {
                $project: {
                    _id: "$project._id",
                    name: "$project.name",
                    role: "$role"
                }
            }
        ])
    }
}
