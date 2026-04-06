import { IUser, User, UserStatus } from "./auth.model"
import mongoose from "mongoose"
import { RegisterDto, UpdateProfileDto } from "./dto/auth.dto"
import logger from "@core/utils/logger"

export default {
    async findByUsername(username: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ username }).exec()
            return user
        } catch (error) {
            logger.error("Error finding user by username", { username, error })
            throw error
        }
    },

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email: email.toLowerCase() }).exec()
            return user
        } catch (error) {
            logger.error("Error finding user by email", { email, error })
            throw error
        }
    },

    async findByIdentifier(identifier: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({
                $or: [
                    { username: identifier },
                    { email: identifier.toLowerCase() },
                ],
            }).exec()
            return user
        } catch (error) {
            logger.error("Error finding user by identifier", { identifier, error })
            throw error
        }
    },

    async findById(id: string): Promise<IUser | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null
            }
            const user = await User.findById(id).exec()
            return user
        } catch (error) {
            logger.error("Error finding user by id", { id, error })
            throw error
        }
    },

    async create(data: RegisterDto): Promise<IUser> {
        try {
            const user = new User({
                username: data.username,
                email: data.email.toLowerCase(),
                name: data.name,
                password: data.password,
                providers: [{ provider: "local", providerId: null }],
                status: UserStatus.ACTIVE,
            })
            const savedUser = await user.save()
            return savedUser
        } catch (error) {
            logger.error("Error creating user", { email: data.email, error })
            throw error
        }
    },

    async update(id: string, data: UpdateProfileDto): Promise<IUser | null> {
        try {
            const updateData: Record<string, unknown> = {}

            if (data.username !== undefined) updateData.username = data.username
            if (data.email !== undefined) updateData.email = data.email.toLowerCase()
            if (data.name !== undefined) updateData.name = data.name
            if (data.avatar !== undefined) updateData.avatar = data.avatar
            if (data.status !== undefined) updateData.status = data.status

            const user = await User.findByIdAndUpdate(id, updateData, { new: true }).exec()
            return user
        } catch (error) {
            logger.error("Error updating user", { id, error })
            throw error
        }
    },

    async updatePassword(id: string, newPassword: string): Promise<IUser | null> {
        try {
            const user = await User.findById(id)
            if (!user) return null

            user.password = newPassword
            return await user.save()
        } catch (error) {
            logger.error("Error updating password", { id, error })
            throw error
        }
    },

    async checkUsernameExists(username: string, excludeId?: string): Promise<boolean> {
        try {
            const query: Record<string, unknown> = { username }
            if (excludeId) {
                query._id = { $ne: new mongoose.Types.ObjectId(excludeId) }
            }
            const count = await User.countDocuments(query).exec()
            return count > 0
        } catch (error) {
            logger.error("Error checking username exists", { username, excludeId, error })
            throw error
        }
    },

    async checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
        try {
            const query: Record<string, unknown> = { email: email.toLowerCase() }
            if (excludeId) {
                query._id = { $ne: new mongoose.Types.ObjectId(excludeId) }
            }
            const count = await User.countDocuments(query).exec()
            return count > 0
        } catch (error) {
            logger.error("Error checking email exists", { email, excludeId, error })
            throw error
        }
    },

    async findByProvider(provider: string, providerId: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({
                providers: {
                    $elemMatch: {
                        provider,
                        providerId,
                    },
                },
            }).exec()
            return user
        } catch (error) {
            logger.error("Error finding user by provider", { provider, providerId, error })
            throw error
        }
    },
}
