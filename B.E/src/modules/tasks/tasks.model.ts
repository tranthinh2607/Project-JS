import mongoose, { Schema, Model, Document } from "mongoose"

export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId
    project_id: mongoose.Types.ObjectId
    parent_task_id: mongoose.Types.ObjectId | null
    title: string
    description?: string
    priority: TaskPriority
    start_date?: Date
    due_date?: Date
    created_by: mongoose.Types.ObjectId
    updated_by?: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
    {
        project_id: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        parent_task_id: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            default: TaskPriority.MEDIUM,
        },
        start_date: {
            type: Date,
            default: null,
        },
        due_date: {
            type: Date,
            default: null,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updated_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

// Indexes for better query performance
TaskSchema.index({ project_id: 1 })
TaskSchema.index({ parent_task_id: 1 })
TaskSchema.index({ project_id: 1, parent_task_id: 1 })

export const Task: Model<ITask> = mongoose.model<ITask>("Task", TaskSchema, "tasks")
