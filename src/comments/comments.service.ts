import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ArticlesService } from 'src/articles/articles.service';
import { forwardRef } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(forwardRef(() => ArticlesService))
    private prisma: PrismaService,
    private readonly articleService: ArticlesService,
  ) {}

async create(dto: CreateCommentDto) {
  const article = await this.prisma.article.findUnique({
    where: { id: dto.articleId },
  });

  if (!article) {
    throw new UnprocessableEntityException('Article not found');
  }

  const comment = await this.prisma.comment.create({
    data: {
      content: dto.content,
      articleId: dto.articleId,
      authorId: dto.authorId ?? null,
    },
  });

  return {
    ...comment,
    createdAt: comment.createdAt.getTime(),
  };
}
async findAll(articleId: string) {
  return this.prisma.comment.findMany({
    where: { articleId },
  });
}

async findOne(id: string) {
  const comment = await this.prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new NotFoundException('Comment not found');
  }

  return comment;
}

async update(id: string, dto: UpdateCommentDto) {
  const comment = await this.prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new NotFoundException('Comment is not found');
  }

  if (!dto.content) {
    throw new NotFoundException('Content is not found');
  }

  return this.prisma.comment.update({
    where: { id },
    data: { content: dto.content },
  });
}

async remove(id: string) {
  const comment = await this.prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new NotFoundException('Comment not found');
  }

  await this.prisma.comment.delete({ where: { id } });
}

async deleteByUser(userId: string) {
  await this.prisma.comment.deleteMany({
    where: { authorId: userId },
  });
}

async deleteByArticle(articleId: string) {
  await this.prisma.comment.deleteMany({
    where: { articleId },
  });
}
}
