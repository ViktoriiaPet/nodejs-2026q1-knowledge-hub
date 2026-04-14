import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import type { Article } from 'src/types';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { CommentsService } from 'src/comments/comments.service';
import { forwardRef } from '@nestjs/common';
import { GetArticlesQueryDto } from './dto/get-articles-query.dto';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class ArticlesService {
  constructor(
    @Inject(forwardRef(() => CommentsService))
    private prisma: PrismaService,
    private readonly commentService: CommentsService,
  ) {}

  private articles: Article[] = [];
  async create(dto: CreateArticleDto) {
  return this.prisma.article.create({
    data: {
      title: dto.title,
      content: dto.content,
      status: dto.status ?? 'draft',
      authorId: dto.authorId ?? null,
      categoryId: dto.categoryId ?? null,

      tags: {
        create: (dto.tags ?? []).map((name) => ({
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
  });
}

async findAll(query: GetArticlesQueryDto) {
  const { status, categoryId, tags, limit, offset } = query;

  return this.prisma.article.findMany({
    where: {
      status,
      categoryId,
      ...(tags?.length && {
        tags: {
          some: {
            tag: {
              name: { in: tags },
            },
          },
        },
      }),
    },
    skip: offset ?? 0,
    take: limit ?? undefined,
  });
}

async findOne(id: string) {
  const article = await this.prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundException('Article not found');
  }

  return article;
}

async update(id: string, dto: UpdateArticleDto) {
  return this.prisma.article.update({
    where: { id },
    data: {
      ...dto,
      ...(dto.tags && {
        tags: {
          deleteMany: {},
          create: dto.tags.map((name:string) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      }),
    },
  });
}

async remove(id: string) {
  const article = await this.prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundException('Article not found');
  }

  await this.prisma.article.delete({ where: { id } });
}
/*
  nullifyAuthor(userId: string) {
    this.articles.forEach((article) => {
      if (article.authorId === userId) {
        article.authorId = null;
      }
    });
  }

  nullifyCategory(categoryId: string) {
    this.articles.forEach((article) => {
      if (article.categoryId === categoryId) {
        article.categoryId = null;
      }
    });
  }
    */
}
