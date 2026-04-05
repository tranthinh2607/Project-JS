import { IsString, MinLength, MaxLength, IsOptional } from "class-validator"

export class CreateProjectDto {
    @IsString({ message: "Tên dự án phải là chuỗi ký tự" })
    @MinLength(3, { message: "Tên dự án phải có ít nhất 3 ký tự" })
    @MaxLength(100, { message: "Tên dự án không được vượt quá 100 ký tự" })
    name!: string

    @IsString({ message: "Mô tả phải là chuỗi ký tự" })
    @IsOptional()
    @MaxLength(500, { message: "Mô tả không được vượt quá 500 ký tự" })
    description?: string
}

export class UpdateProjectDto {
    @IsString({ message: "Tên dự án phải là chuỗi ký tự" })
    @MinLength(3, { message: "Tên dự án phải có ít nhất 3 ký tự" })
    @MaxLength(100, { message: "Tên dự án không được vượt quá 100 ký tự" })
    name!: string

    @IsString({ message: "Mô tả phải là chuỗi ký tự" })
    @IsOptional()
    @MaxLength(500, { message: "Mô tả không được vượt quá 500 ký tự" })
    description?: string
}
