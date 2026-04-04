import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsString, IsNotEmpty, IsOptional, IsIn } from "class-validator";

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content?: string;
}
