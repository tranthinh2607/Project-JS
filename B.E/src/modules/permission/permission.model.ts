import mongoose, { Schema, Model } from "mongoose"

export interface IPermission {
    _id: mongoose.Types.ObjectId
    name: string
    key: string
    description?: string
    createdAt?: Date
    updatedAt?: Date
}

const PermissionSchema = new Schema<IPermission>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    key: {
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

export const Permission: Model<IPermission> = mongoose.model<IPermission>("Permission", PermissionSchema)
