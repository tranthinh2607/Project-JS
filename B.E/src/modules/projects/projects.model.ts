import mongoose, { Schema, Model, Document } from "mongoose"

export interface IProject extends Document {
    _id: mongoose.Types.ObjectId
    code: string
    name: string
    description?: string
    owner_id: mongoose.Types.ObjectId
    expected_start_date?: Date
    expected_end_date?: Date
    status: "active" | "completed" | "on_hold" | "cancelled"
    createdAt: Date
    updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        owner_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expected_start_date: {
            type: Date,
            default: null,
        },
        expected_end_date: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["active", "completed", "on_hold", "cancelled"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
)

// Index for better query performance
ProjectSchema.index({ name: 1 })
ProjectSchema.index({ owner_id: 1 })

export const Project: Model<IProject> = mongoose.model<IProject>("Project", ProjectSchema, "projects")
