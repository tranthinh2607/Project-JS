import mongoose, { Schema, Model } from "mongoose"
import bcrypt from "bcrypt"

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned",
}

export interface IProvider {
    provider: string
    providerId?: string
}

export interface IUser {
    _id: mongoose.Types.ObjectId
    username: string
    email: string
    password: string
    avatar?: string
    status: UserStatus
    roles: string[]
    providers: IProvider[]
    createdAt?: Date
    updatedAt?: Date
    comparePassword(candidatePassword: string): Promise<boolean>
}

const ProviderSchema = new Schema({
    provider: { type: String, required: true },
    providerId: { type: String },
}, { _id: false })

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    },
    roles: {
        type: [String],
        default: ["user"],
    },
    providers: {
        type: [ProviderSchema],
        default: [{ provider: "local", providerId: null }],
    },
}, {
    timestamps: true,
})

// Index for better query performance
UserSchema.index({ username: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ "providers.provider": 1, "providers.providerId": 1 })

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.set("password", await bcrypt.hash(this.get("password") as string, salt))
        next()
    } catch (error) {
        next(error as Error)
    }
})

// Compare password method
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    const user = this as IUser
    return bcrypt.compare(candidatePassword, user.password)
}

// Transform output to remove sensitive fields
UserSchema.set("toJSON", {
    transform: function (_doc, ret) {
        ret.password = undefined as any
        return ret
    },
})

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema)
