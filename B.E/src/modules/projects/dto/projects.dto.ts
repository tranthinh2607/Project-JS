import { IsString, MinLength, MaxLength, IsOptional, IsDateString, IsEnum } from "class-validator"

export class CreateProjectDto {
    @IsString({ message: "Tên dự án phải là chuỗi ký tự" })
    @MinLength(3, { message: "Tên dự án phải có ít nhất 3 ký tự" })
    @MaxLength(100, { message: "Tên dự án không được vượt quá 100 ký tự" })
    name!: string

    @IsString({ message: "Mô tả phải là chuỗi ký tự" })
    @IsOptional()
    @MaxLength(500, { message: "Mô tả không được vượt quá 500 ký tự" })
    description?: string

    @IsOptional()
    @IsDateString({}, { message: "Ngày bắt đầu không hợp lệ" })
    expected_start_date?: string

    @IsOptional()
    @IsDateString({}, { message: "Ngày kết thúc không hợp lệ" })
    expected_end_date?: string

    @IsOptional()
    @IsEnum(["active", "completed", "on_hold", "cancelled"], { message: "Trạng thái không hợp lệ" })
    status?: string
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

    @IsOptional()
    @IsDateString({}, { message: "Ngày bắt đầu không hợp lệ" })
    expected_start_date?: string

    @IsOptional()
    @IsDateString({}, { message: "Ngày kết thúc không hợp lệ" })
    expected_end_date?: string

    @IsOptional()
    @IsEnum(["active", "completed", "on_hold", "cancelled"], { message: "Trạng thái không hợp lệ" })
    status?: string
}
