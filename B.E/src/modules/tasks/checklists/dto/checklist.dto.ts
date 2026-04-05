import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator"

export class CreateChecklistItemDto {
    @IsString()
    @IsNotEmpty()
    title!: string
}

export class UpdateChecklistItemDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string
}

export class ToggleChecklistItemDto {
    @IsBoolean()
    @IsNotEmpty()
    is_completed!: boolean
}
