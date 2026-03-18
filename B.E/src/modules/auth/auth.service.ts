import repo from "./auth.repository"
import ApiError from "@core/utils/apiError"
import { env } from "@core/config/env.config"
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from "./dto/auth.dto"
import jwt, { JwtPayload } from "jsonwebtoken"
import mongoose from "mongoose"
import { IUser, UserStatus } from "./auth.model"

interface TokenPayload extends JwtPayload {
    userId: string
    username: string
    email: string
    roles: mongoose.Types.ObjectId[]
}

interface RefreshTokenPayload extends JwtPayload {
    userId: string
    type: string
}


const generateTokens = (user: IUser): { accessToken: string, refreshToken: string } => {
    const payload: TokenPayload = {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        roles: user.roles,
    }

    const accessToken = jwt.sign(payload, env.jwt.secret, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expiresIn: env.jwt.expire_access as any,
    })

    const refreshToken = jwt.sign(
        { userId: user._id.toString(), type: "refresh" },
        env.jwt.secret,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { expiresIn: env.jwt.expire_refresh as any }
    )

    return {
        accessToken,
        refreshToken,
    }
}

export default {
    async register(dto: RegisterDto) {
        // Check if username exists
        const existingUsername = await repo.findByUsername(dto.username)
        if (existingUsername) {
            return new ApiError(400, "Username đã tồn tại", "username", [
                "Username này đã được đăng ký",
            ])
        }

        // Check if email exists
        const existingEmail = await repo.findByEmail(dto.email)
        if (existingEmail) {
            return new ApiError(400, "Email đã tồn tại", "email", [
                "Email này đã được đăng ký",
            ])
        }

        // Create user
        const user = await repo.create(dto)

        // Generate tokens
        const result = generateTokens(user)

        return { data: { ...result, user } }
    },

    async login(dto: LoginDto) {
        // Validate user exists
        const user = await this.validateUserExists(dto.username)
        if (user instanceof ApiError) return user

        // Validate password
        const isPasswordValid = await this.validatePassword(user, dto.password)
        if (!isPasswordValid) {
            return new ApiError(401, "Thông tin đăng nhập không chính xác", "password", [
                "Mật khẩu không đúng",
            ])
        }

        // Validate user status
        const isActive = this.validateUserStatus(user)
        if (!isActive) {
            return new ApiError(403, "Tài khoản bị vô hiệu hóa", "status", [
                "Tài khoản của bạn đã bị vô hiệu hóa",
            ])
        }

        // Generate tokens
        const result = generateTokens(user)

        return { data: result }
    },

    async validateUserExists(username: string): Promise<IUser | ApiError> {
        const user = await repo.findByUsername(username)
        if (!user) {
            return new ApiError(401, "Thông tin đăng nhập không chính xác", "username", [
                "Username không đúng",
            ])
        }
        return user
    },

    async validatePassword(user: IUser, password: string): Promise<boolean> {
        // Use dummy password for non-existent user to prevent timing attack
        const passwordToCompare = password || "dummy_password_for_timing_attack_prevention"
        return await user.comparePassword(passwordToCompare)
    },

    validateUserStatus(user: IUser): boolean {
        return user.status === UserStatus.ACTIVE
    },

    async getProfile(userId: string) {
        const user = await repo.findById(userId)
        if (!user) {
            return new ApiError(404, "Không tìm thấy người dùng", "user", [
                "Người dùng không tồn tại",
            ])
        }

        return { data: user }
    },

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const user = await repo.findById(userId)
        if (!user) {
            return new ApiError(404, "Không tìm thấy người dùng", "user", [
                "Người dùng không tồn tại",
            ])
        }

        // Check if username is being changed and if it already exists
        if (dto.username && dto.username !== user.username) {
            const usernameExists = await repo.checkUsernameExists(dto.username, userId)
            if (usernameExists) {
                return new ApiError(400, "Username đã tồn tại", "username", [
                    "Username này đã được đăng ký",
                ])
            }
        }

        // Check if email is being changed and if it already exists
        if (dto.email && dto.email.toLowerCase() !== user.email) {
            const emailExists = await repo.checkEmailExists(dto.email, userId)
            if (emailExists) {
                return new ApiError(400, "Email đã tồn tại", "email", [
                    "Email này đã được đăng ký",
                ])
            }
        }

        // Update profile
        const updatedUser = await repo.update(userId, dto)
        if (!updatedUser) {
            return new ApiError(500, "Lỗi server", "server", [
                "Không thể cập nhật thông tin",
            ])
        }

        return { data: updatedUser }
    },

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await repo.findById(userId)
        if (!user) {
            return new ApiError(404, "Không tìm thấy người dùng", "user", [
                "Người dùng không tồn tại",
            ])
        }

        // Check old password
        const isPasswordValid = await user.comparePassword(dto.oldPassword)
        if (!isPasswordValid) {
            return new ApiError(400, "Mật khẩu cũ không chính xác", "oldPassword", [
                "Mật khẩu cũ không đúng",
            ])
        }

        // Check if new password is same as old
        const isSamePassword = await user.comparePassword(dto.newPassword)
        if (isSamePassword) {
            return new ApiError(400, "Mật khẩu mới phải khác mật khẩu cũ", "newPassword", [
                "Vui lòng chọn mật khẩu khác mật khẩu cũ",
            ])
        }

        // Update password
        await repo.updatePassword(userId, dto.newPassword)

        return { data: { message: "Đổi mật khẩu thành công" } }
    },

    async refreshToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, env.jwt.secret) as RefreshTokenPayload

            if (decoded.type !== "refresh") {
                return new ApiError(401, "Token không hợp lệ", "token", [
                    "Refresh token không hợp lệ",
                ])
            }

            const user = await repo.findById(decoded.userId)
            if (!user) {
                return new ApiError(404, "Không tìm thấy người dùng", "user", [
                    "Người dùng không tồn tại",
                ])
            }

            if (user.status !== UserStatus.ACTIVE) {
                return new ApiError(403, "Tài khoản bị vô hiệu hóa", "status", [
                    "Tài khoản của bạn đã bị vô hiệu hóa",
                ])
            }

            const result = generateTokens(user)
            return { data: result }
        } catch {
            return new ApiError(401, "Token không hợp lệ", "token", [
                "Refresh token đã hết hạn hoặc không hợp lệ",
            ])
        }
    },
}
