import mongoose, { Schema, Model } from "mongoose"

export interface IRolePermission {
    _id: mongoose.Types.ObjectId
    roleId: mongoose.Types.ObjectId
    permissionId: mongoose.Types.ObjectId
    createdAt?: Date
    updatedAt?: Date
}

const RolePermissionSchema = new Schema<IRolePermission>({
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
    permissionId: {
        type: Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
    },
}, {
    timestamps: true,
})

// Optional: ensure unique role-permission mapping
RolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true })

export const RolePermission: Model<IRolePermission> = mongoose.model<IRolePermission>("RolePermission", RolePermissionSchema)
