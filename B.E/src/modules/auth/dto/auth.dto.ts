import {
    IsString,
    IsEmail,
    IsOptional,
    MinLength,
    MaxLength,
    IsEnum,
    IsArray,
    IsUrl,
} from "class-validator"
import { UserStatus } from "../auth.model"

export class RegisterDto {
    @IsString({ message: "Username phải là chuỗi ký tự" })
    @MinLength(3, { message: "Username phải có ít nhất 3 ký tự" })
    @MaxLength(50, { message: "Username không được vượt quá 50 ký tự" })
    username!: string

    @IsEmail({}, { message: "Email không hợp lệ" })
    email!: string
 
    @IsString({ message: "Name phải là chuỗi ký tự" })
    @MinLength(3, { message: "Name phải có ít nhất 3 ký tự" })
    @MaxLength(100, { message: "Name không được vượt quá 100 ký tự" })
    name!: string

    @IsString({ message: "Password phải là chuỗi ký tự" })
    @MinLength(6, { message: "Password phải có ít nhất 6 ký tự" })
    @MaxLength(100, { message: "Password không được vượt quá 100 ký tự" })
    password!: string
}

export class LoginDto {
    @IsString({ message: "Username phải là chuỗi ký tự" })
    @MinLength(3, { message: "Username phải có ít nhất 3 ký tự" })
    @MaxLength(50, { message: "Username không được vượt quá 50 ký tự" })
    username!: string

    @IsString({ message: "Password phải là chuỗi ký tự" })
    password!: string
}

export class UpdateProfileDto {
    @IsOptional()
    @IsString({ message: "Username phải là chuỗi ký tự" })
    @MinLength(3, { message: "Username phải có ít nhất 3 ký tự" })
    @MaxLength(50, { message: "Username không được vượt quá 50 ký tự" })
    username?: string

    @IsOptional()
    @IsEmail({}, { message: "Email không hợp lệ" })
    email?: string

    @IsOptional()
    @IsString({ message: "Name phải là chuỗi ký tự" })
    name?: string

    @IsOptional()
    @IsUrl({}, { message: "Avatar URL không hợp lệ" })
    avatar?: string

    @IsOptional()
    @IsEnum(UserStatus, { message: "Status không hợp lệ" })
    status?: UserStatus
}

export class ChangePasswordDto {
    @IsOptional()
    @IsString({ message: "Password cũ phải là chuỗi ký tự" })
    @MinLength(6, { message: "Password cũ phải có ít nhất 6 ký tự" })
    oldPassword?: string

    @IsString({ message: "Password mới phải là chuỗi ký tự" })
    @MinLength(6, { message: "Password mới phải có ít nhất 6 ký tự" })
    @MaxLength(100, { message: "Password mới không được vượt quá 100 ký tự" })
    newPassword!: string
}

export class GoogleLoginDto {
    @IsString({ message: "Token phải là chuỗi ký tự" })
    token!: string
}
