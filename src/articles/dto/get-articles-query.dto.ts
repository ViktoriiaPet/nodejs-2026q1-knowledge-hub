import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetArticlesQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value))
  authorId?: string | null;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  status: 'draft' | 'published' | 'archived';

  @IsOptional()
  categoryId: string | null;

  @IsOptional()
  tags: string[];
}
