import { IsString, IsNotEmpty } from "class-validator"

export class CreateDocumentDto {
    @IsString()
    @IsNotEmpty({ message: "Project ID không được để trống" })
    project_id!: string
}
