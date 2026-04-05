import mongoose, { Schema, Model, Document } from "mongoose"

export interface ITaskAssignee extends Document {
    _id: mongoose.Types.ObjectId
    task_id: mongoose.Types.ObjectId
    user_id: mongoose.Types.ObjectId
    assigned_by: mongoose.Types.ObjectId
    createdAt: Date
}

const TaskAssigneeSchema = new Schema<ITaskAssignee>(
    {
        task_id: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assigned_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
)

// Ensure unique assignment per task
TaskAssigneeSchema.index({ task_id: 1, user_id: 1 }, { unique: true })

export const TaskAssignee: Model<ITaskAssignee> = mongoose.model<ITaskAssignee>("TaskAssignee", TaskAssigneeSchema, "task_assignees")
