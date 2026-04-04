import { IsString, IsNotEmpty, IsOptional, IsIn } from "class-validator";
export class CreateArticleDto {
        @IsString()
        @IsNotEmpty()
        title: string;
    
        @IsString()
        @IsNotEmpty()
        content: string;
    
        @IsOptional()
        @IsIn(['draft','published', 'archived'])
        status?: 'draft' | 'published' | 'archived'

        @IsOptional()
        authorId: string | null;
        categoryId: string | null;
        tags: string[] | [];
}
