import mongoose, { Schema, Document } from "mongoose"

export interface IDocument extends Document {
    project_id: mongoose.Types.ObjectId
    name: string
    original_name: string
    path: string
    size: number
    mime_type: string
    created_by: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const DocumentSchema: Schema = new Schema(
    {
        project_id: { type: Schema.Types.ObjectId, ref: "projects", required: true },
        name: { type: String, required: true },
        original_name: { type: String, required: true },
        path: { type: String, required: true },
        size: { type: Number, required: true },
        mime_type: { type: String, required: true },
        created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
        collection: "documents",
    }
)

export const DocumentModel = mongoose.model<IDocument>("Document", DocumentSchema)
