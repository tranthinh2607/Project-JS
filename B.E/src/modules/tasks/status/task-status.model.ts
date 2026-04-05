import mongoose, { Schema, Model, Document } from "mongoose"

export enum TaskStatusEnum {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    BLOCKED = "blocked",
    DONE = "done",
}

export interface ITaskStatus extends Document {
    _id: mongoose.Types.ObjectId
    task_id: mongoose.Types.ObjectId
    status: TaskStatusEnum
    note?: string
    changed_by: mongoose.Types.ObjectId
    createdAt: Date
}

const TaskStatusSchema = new Schema<ITaskStatus>(
    {
        task_id: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(TaskStatusEnum),
            required: true,
        },
        note: {
            type: String,
            trim: true,
            default: null,
        },
        changed_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
)

// Index for getting latest status efficiently
TaskStatusSchema.index({ task_id: 1, createdAt: -1 })

export const TaskStatus: Model<ITaskStatus> = mongoose.model<ITaskStatus>("TaskStatus", TaskStatusSchema, "task_status")
