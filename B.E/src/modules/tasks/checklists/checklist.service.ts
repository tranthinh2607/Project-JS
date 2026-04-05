import repo from "./checklist.repository"
import taskRepo from "../tasks.repository"
import { CreateChecklistItemDto, ToggleChecklistItemDto } from "./dto/checklist.dto"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"

export default {
    async addItem(taskId: string, dto: CreateChecklistItemDto, userId: string) {
        const task = await taskRepo.findById(taskId)
        if (!task) {
            return new ApiError(404, "Không tìm thấy công việc")
        }

        const item = await repo.create({
            task_id: new mongoose.Types.ObjectId(taskId) as any,
            title: dto.title,
        })
        return { data: item }
    },

    async getItems(taskId: string) {
        const items = await repo.findByTask(taskId)
        return { data: items }
    },

    async toggleItem(itemId: string, dto: ToggleChecklistItemDto, userId: string) {
        const item = await repo.findById(itemId)
        if (!item) {
            return new ApiError(404, "Không tìm thấy checklist item")
        }

        const updated = await repo.toggle(itemId, dto.is_completed, userId)
        return { data: updated }
    },

    async deleteItem(itemId: string) {
        const item = await repo.findById(itemId)
        if (!item) {
            return new ApiError(404, "Không tìm thấy checklist item")
        }
        await repo.delete(itemId)
        return { data: null }
    }
}
