import mongoose, { Schema, Model } from "mongoose"
import bcrypt from "bcrypt"

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned",
}

export interface IProvider {
    provider: string
    providerId?: string | null
}

export interface IUser {
    _id: mongoose.Types.ObjectId
    username: string
    email: string
    name: string
    password: string
    avatar?: string | null
    status: UserStatus
    roles: mongoose.Types.ObjectId[]
    providers: IProvider[]
    createdAt?: Date
    updatedAt?: Date
    comparePassword(candidatePassword: string): Promise<boolean>
}

const ProviderSchema = new Schema<IProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, default: null },
}, { _id: false })

const UserSchema = new Schema<IUser>({
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
    name: {
        type: String,
        required: true,
        trim: true,
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
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE,
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: "Role",
    }],
    providers: {
        type: [ProviderSchema],
        default: [{ provider: "local", providerId: null }],
    },
}, {
    timestamps: true,
})

// Index for better query performance
UserSchema.index({ "providers.provider": 1, "providers.providerId": 1 })

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error as Error)
    }
})

// Compare password method
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
}

// Transform output to remove sensitive fields
UserSchema.set("toJSON", {
    transform: function (_doc, ret) {
        // @ts-ignore
        delete ret.password
        return ret
    },
})

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema, "User")
