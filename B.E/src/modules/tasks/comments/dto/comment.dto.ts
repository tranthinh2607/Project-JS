import { IsString, IsNotEmpty, MaxLength } from "class-validator"

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: "Nội dung bình luận không được để trống" })
    @MaxLength(1000, { message: "Bình luận không được vượt quá 1000 ký tự" })
    content!: string
}
