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

    async findByProject(project_id: string): Promise<any[]> {
        return await ProjectMember.aggregate([
            { $match: { project_id: new mongoose.Types.ObjectId(project_id) } },
            {
                $lookup: {
                    from: "User",
                    localField: "email",
                    foreignField: "email",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
        ])
    },

    async findByEmail(email: string): Promise<IProjectMember[]> {
        return await ProjectMember.find({ email }).populate("project_id").exec()
    },

    async findByProjectAndEmail(project_id: string, email: string): Promise<IProjectMember | null> {
        return await ProjectMember.findOne({ project_id, email }).exec()
    },

    async update(id: string, data: UpdateProjectMemberDto): Promise<IProjectMember | null> {
        return await ProjectMember.findByIdAndUpdate(id, data, { new: true }).exec()
    },

    async delete(id: string): Promise<IProjectMember | null> {
        return await ProjectMember.findByIdAndDelete(id).exec()
    },

    async deleteByProjectAndEmail(project_id: string, email: string): Promise<IProjectMember | null> {
        return await ProjectMember.findOneAndDelete({ project_id, email }).exec()
    },

    async getUserProjects(email: string, page: number = 1, limit: number = 10, keyword?: string) {
        const skip = (page - 1) * limit
        const pipeline: any[] = [
            {
                $match: { email }
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
            }
        ]

        if (keyword) {
            pipeline.push({
                $match: {
                    "project.name": { $regex: keyword, $options: "i" }
                }
            })
        }

        pipeline.push({
            $facet: {
                data: [
                    { $sort: { "project.createdAt": -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            _id: "$project._id",
                            code: "$project.code",
                            name: "$project.name",
                            description: "$project.description",
                            createdAt: "$project.createdAt",
                            role: "$role"
                        }
                    }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        })

        const result = await ProjectMember.aggregate(pipeline)
        const data = result[0].data
        const totalRow = result[0].totalCount[0]?.count || 0
        const totalPage = Math.ceil(totalRow / limit)

        return {
            data,
            pagination: {
                limit,
                page,
                totalRow,
                totalPage
            }
        }
    }
}
