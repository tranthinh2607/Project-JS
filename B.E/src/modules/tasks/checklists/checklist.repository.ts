import { Checklist, IChecklist } from "./checklist.model"
import mongoose from "mongoose"

export default {
    async create(data: Partial<IChecklist>) {
        const doc = new Checklist(data)
        return await doc.save()
    },

    async findById(id: string) {
        return await Checklist.findById(id).lean()
    },

    async findByTask(taskId: string) {
        return await Checklist.find({ task_id: new mongoose.Types.ObjectId(taskId) })
            .sort({ createdAt: 1 })
            .lean()
    },

    async toggle(id: string, isCompleted: boolean, userId: string) {
        return await Checklist.findByIdAndUpdate(
            id,
            {
                is_completed: isCompleted,
                completed_by: isCompleted ? new mongoose.Types.ObjectId(userId) : null,
                completed_at: isCompleted ? new Date() : null,
            },
            { new: true }
        ).lean()
    },

    async delete(id: string) {
        return await Checklist.findByIdAndDelete(id)
    }
}
