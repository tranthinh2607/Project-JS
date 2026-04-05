import { TaskStatus, ITaskStatus } from "./task-status.model"
import mongoose from "mongoose"

export default {
    async create(data: Partial<ITaskStatus>) {
        const doc = new TaskStatus(data)
        return await doc.save()
    },

    async getLatestStatus(taskId: string) {
        const statuses = await TaskStatus.find({ task_id: new mongoose.Types.ObjectId(taskId) })
            .sort({ createdAt: -1 })
            .limit(1)
            .lean()
        return statuses[0] || null
    },

    async getStatusHistory(taskId: string) {
        return await TaskStatus.find({ task_id: new mongoose.Types.ObjectId(taskId) })
            .sort({ createdAt: -1 })
            .lean()
    }
}
