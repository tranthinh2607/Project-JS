import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsMongoId } from "class-validator"
import { TaskPriority } from "../tasks.model"

export class CreateTaskDto {
    @IsMongoId()
    @IsNotEmpty()
    project_id!: string

    @IsMongoId()
    @IsOptional()
    parent_task_id?: string

    @IsString()
    @IsNotEmpty()
    title!: string

    @IsString()
    @IsOptional()
    description?: string

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority

    @IsDateString()
    @IsOptional()
    start_date?: string

    @IsDateString()
    @IsOptional()
    due_date?: string
}

export class UpdateTaskDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority

    @IsDateString()
    @IsOptional()
    start_date?: string

    @IsDateString()
    @IsOptional()
    due_date?: string
}
