import { IsString, IsNotEmpty, IsOptional, IsIn, isString } from "class-validator";
export class CreateCommentDto {
       @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    articleId: string;

    @IsOptional()
    authorId?: string | null
}
