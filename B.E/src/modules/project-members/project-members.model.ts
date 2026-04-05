import mongoose, { Schema, Model, Document } from "mongoose"

export enum ProjectMemberRole {
    OWNER = "owner",
    MEMBER = "member",
}

export interface IProjectMember extends Document {
    _id: mongoose.Types.ObjectId
    project_id: mongoose.Types.ObjectId
    email: string
    role: ProjectMemberRole
    createdAt: Date
}

const ProjectMemberSchema = new Schema<IProjectMember>(
    {
        project_id: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: Object.values(ProjectMemberRole),
            default: ProjectMemberRole.MEMBER,
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
)

// Index for better query performance
ProjectMemberSchema.index({ project_id: 1, email: 1 }, { unique: true })
ProjectMemberSchema.index({ email: 1 })

export const ProjectMember: Model<IProjectMember> = mongoose.model<IProjectMember>(
    "ProjectMember",
    ProjectMemberSchema,
    "project_members"
)
