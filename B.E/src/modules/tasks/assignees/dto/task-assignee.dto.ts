import { IsNotEmpty, IsMongoId } from "class-validator"

export class AssignTaskDto {
    @IsMongoId()
    @IsNotEmpty()
    user_id!: string
}
