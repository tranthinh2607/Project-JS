import { TaskCommentModel, ITaskComment } from "./comment.model"
import mongoose from "mongoose"

export default {
    async create(data: Partial<ITaskComment>) {
        const comment = new TaskCommentModel(data)
        return await comment.save()
    },

    async findByTask(taskId: string) {
        return await TaskCommentModel.find({ task_id: new mongoose.Types.ObjectId(taskId) })
            .populate("user_id", "name avatar email")
            .sort({ createdAt: -1 })
            .lean()
    },

    async findById(id: string) {
        return await TaskCommentModel.findById(id).lean()
    },

    async delete(id: string) {
        return await TaskCommentModel.findByIdAndDelete(id)
    }
}
