import mongoose, { Schema, Model } from "mongoose"

export interface IRole {
    _id: mongoose.Types.ObjectId
    name: string
    description?: string
    createdAt?: Date
    updatedAt?: Date
}

const RoleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
})

export const Role: Model<IRole> = mongoose.model<IRole>("Role", RoleSchema)
