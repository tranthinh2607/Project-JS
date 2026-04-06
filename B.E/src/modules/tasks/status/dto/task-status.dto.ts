import { IsString, IsNotEmpty, IsEnum, IsOptional, ValidateIf } from "class-validator"
import { TaskStatusEnum } from "../task-status.model"

export class ChangeTaskStatusDto {
    @IsEnum(TaskStatusEnum)
    @IsNotEmpty()
    status!: TaskStatusEnum

    @IsString()
    @ValidateIf((o) => o.status === TaskStatusEnum.BLOCKED)
    @IsNotEmpty({ message: "Note is required when status is blocked" })
    @IsOptional()
    note?: string
}
