import repo from "./comment.repository"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"

export default {
    async addComment(taskId: string, userId: string, content: string) {
        const comment = await repo.create({
            task_id: new mongoose.Types.ObjectId(taskId) as any,
            user_id: new mongoose.Types.ObjectId(userId) as any,
            content
        })

        // Populate user info for immediate display
        const populated = await repo.findById(comment._id.toString())
        return { data: populated }
    },

    async getComments(taskId: string) {
        const comments = await repo.findByTask(taskId)
        return { data: comments }
    },

    async deleteComment(commentId: string, userId: string) {
        const comment = await repo.findById(commentId)
        if (!comment) {
            return new ApiError(404, "Không tìm thấy bình luận")
        }

        if (comment.user_id._id.toString() !== userId) {
            return new ApiError(403, "Bạn không có quyền xóa bình luận này")
        }

        await repo.delete(commentId)
        return { data: null }
    }
}
