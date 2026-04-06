import mongoose, { Schema, Document } from "mongoose"

export interface ITaskComment extends Document {
    task_id: mongoose.Types.ObjectId
    user_id: mongoose.Types.ObjectId
    content: string
    createdAt: Date
    updatedAt: Date
}

const CommentSchema: Schema = new Schema(
    {
        task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: "task_comments",
    }
)

export const TaskCommentModel = mongoose.model<ITaskComment>("TaskComment", CommentSchema)
