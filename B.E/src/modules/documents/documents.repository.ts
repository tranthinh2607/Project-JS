import { DocumentModel, IDocument } from "./documents.model"
import mongoose from "mongoose"

export default {
    async create(data: Partial<IDocument>) {
        const doc = new DocumentModel(data)
        return await doc.save()
    },

    async findByProject(projectId: string, skip: number, limit: number) {
        return await DocumentModel.find({ project_id: new mongoose.Types.ObjectId(projectId) })
            .populate("created_by", "name avatar email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
    },

    async countByProject(projectId: string) {
        return await DocumentModel.countDocuments({ project_id: new mongoose.Types.ObjectId(projectId) })
    },

    async findById(id: string) {
        return await DocumentModel.findById(id).lean()
    },

    async delete(id: string) {
        return await DocumentModel.findByIdAndDelete(id)
    }
}
