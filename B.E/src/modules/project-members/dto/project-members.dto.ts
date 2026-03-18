import { IsEnum, IsMongoId, IsNotEmpty } from "class-validator"
import { ProjectMemberRole } from "../project-members.model"

export class CreateProjectMemberDto {
    @IsMongoId({ message: "ID dự án không hợp lệ" })
    @IsNotEmpty({ message: "ID dự án không được để trống" })
    project_id!: string

    @IsMongoId({ message: "ID người dùng không hợp lệ" })
    @IsNotEmpty({ message: "ID người dùng không được để trống" })
    user_id!: string

    @IsEnum(ProjectMemberRole, { message: "Vai trò không hợp lệ" })
    role?: ProjectMemberRole
}

export class UpdateProjectMemberDto {
    @IsEnum(ProjectMemberRole, { message: "Vai trò không hợp lệ" })
    @IsNotEmpty({ message: "Vai trò không được để trống" })
    role!: ProjectMemberRole
}
