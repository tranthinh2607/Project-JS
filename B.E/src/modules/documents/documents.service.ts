import repo from "./documents.repository"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"
import fs from "fs"
import path from "path"

export default {
    async uploadDocument(projectId: string, userId: string, file: Express.Multer.File) {
        if (!file) {
            return new ApiError(400, "Không có file nào được tải lên")
        }

        const document = await repo.create({
            project_id: new mongoose.Types.ObjectId(projectId) as any,
            name: file.filename,
            original_name: file.originalname,
            path: `/uploads/documents/${file.filename}`,
            size: file.size,
            mime_type: file.mimetype,
            created_by: new mongoose.Types.ObjectId(userId) as any
        })

        return { data: document }
    },

    async getDocuments(projectId: string, query: any) {
        const page = parseInt(query.page || "1")
        const limit = parseInt(query.limit || "10")
        const skip = (page - 1) * limit

        const [documents, totalRow] = await Promise.all([
            repo.findByProject(projectId, skip, limit),
            repo.countByProject(projectId)
        ])

        return {
            data: documents,
            pagination: {
                totalRow,
                page,
                limit
            }
        }
    },

    async deleteDocument(documentId: string, userId: string) {
        const document = await repo.findById(documentId)
        if (!document) {
            return new ApiError(404, "Không tìm thấy tài liệu")
        }

        // Logic check permission: Only uploader or project owner?
        // Let's keep it simple for now or check project owner if needed

        // Delete file from storage
        const filePath = path.join(process.cwd(), "uploads/documents", document.name)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        await repo.delete(documentId)
        return { data: null }
    }
}
