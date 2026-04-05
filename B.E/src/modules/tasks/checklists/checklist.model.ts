import mongoose, { Schema, Model, Document } from "mongoose"

export interface IChecklist extends Document {
    _id: mongoose.Types.ObjectId
    task_id: mongoose.Types.ObjectId
    title: string
    is_completed: boolean
    completed_by?: mongoose.Types.ObjectId
    completed_at?: Date
    createdAt: Date
}

const ChecklistSchema = new Schema<IChecklist>(
    {
        task_id: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        is_completed: {
            type: Boolean,
            default: false,
        },
        completed_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        completed_at: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
)

ChecklistSchema.index({ task_id: 1 })

export const Checklist: Model<IChecklist> = mongoose.model<IChecklist>("Checklist", ChecklistSchema, "checklists")
