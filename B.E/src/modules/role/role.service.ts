import { User } from "../auth/auth.model"
import { Role } from "./role.model"
import ApiError from "@core/utils/apiError"
import mongoose from "mongoose"

export default {
    async assignRoleToUser(userId: string, roleId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId)) {
            return new ApiError(400, "ID không hợp lệ", "id", [
                "User ID hoặc Role ID không hợp lệ",
            ])
        }

        const user = await User.findById(userId)
        if (!user) {
            return new ApiError(404, "Không tìm thấy người dùng", "user", [
                "Người dùng không tồn tại",
            ])
        }

        const role = await Role.findById(roleId)
        if (!role) {
            return new ApiError(404, "Không tìm thấy quyền", "role", [
                "Quyền không tồn tại",
            ])
        }

        // Check if user already has the role
        const roleObjectId = new mongoose.Types.ObjectId(roleId)
        if (user.roles.includes(roleObjectId)) {
            return new ApiError(400, "Người dùng đã có quyền này", "role", [
                "Người dùng đã được gán quyền này",
            ])
        }

        // Add role to user
        user.roles.push(roleObjectId)
        await user.save()

        return { data: { message: "Gán quyền thành công", user } }
    },

    async getUserRoles(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return new ApiError(400, "ID không hợp lệ", "id", [
                "User ID không hợp lệ",
            ])
        }

        const user = await User.findById(userId).populate("roles", "name description").exec()
        if (!user) {
            return new ApiError(404, "Không tìm thấy người dùng", "user", [
                "Người dùng không tồn tại",
            ])
        }

        return { data: { roles: user.roles } }
    },

    async assignPermissionToRole(roleId: string, permissionId: string) {
        if (!mongoose.Types.ObjectId.isValid(roleId) || !mongoose.Types.ObjectId.isValid(permissionId)) {
            return new ApiError(400, "ID không hợp lệ", "id", [
                "Role ID hoặc Permission ID không hợp lệ",
            ])
        }

        const role = await Role.findById(roleId)
        if (!role) {
            return new ApiError(404, "Không tìm thấy quyền (role)", "role", [
                "Quyền (role) không tồn tại",
            ])
        }

        const { Permission } = await import("../permission/permission.model")
        const permission = await Permission.findById(permissionId)
        if (!permission) {
            return new ApiError(404, "Không tìm thấy permission", "permission", [
                "Permission không tồn tại",
            ])
        }

        const { RolePermission } = await import("./rolePermission.model")

        // Check if role already has this permission
        const existingAssignment = await RolePermission.findOne({
            roleId: new mongoose.Types.ObjectId(roleId),
            permissionId: new mongoose.Types.ObjectId(permissionId),
        })

        if (existingAssignment) {
            return new ApiError(400, "Role đã có permission này", "permission", [
                "Permission này đã được gán cho role",
            ])
        }

        // Add permission to role
        const rolePermission = new RolePermission({
            roleId: new mongoose.Types.ObjectId(roleId),
            permissionId: new mongoose.Types.ObjectId(permissionId),
        })

        await rolePermission.save()

        return { data: { message: "Gán permission thành công", rolePermission } }
    },

    async getUserPermissions(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return new ApiError(400, "ID không hợp lệ", "id", [
                "User ID không hợp lệ",
            ])
        }

        const user = await User.findById(userId)
        if (!user) {
            return new ApiError(404, "Không tìm thấy người dùng", "user", [
                "Người dùng không tồn tại",
            ])
        }

        if (!user.roles || user.roles.length === 0) {
            return { data: { permissions: [] } }
        }

        const { RolePermission } = await import("./rolePermission.model")

        // Find all role-permission mappings for the user's roles
        const rolePermissions = await RolePermission.find({
            roleId: { $in: user.roles },
        }).populate("permissionId").exec()

        // Extract permission objects, filter out nulls (if any ref is broken), and deduplicate by _id
        const permissionMap = new Map<string, unknown>()

        for (const rp of rolePermissions) {
            if (rp.permissionId) {
                const perm = rp.permissionId as unknown as { _id: mongoose.Types.ObjectId }
                permissionMap.set(perm._id.toString(), perm)
            }
        }

        const permissions = Array.from(permissionMap.values())

        return { data: { permissions } }
    },
}
