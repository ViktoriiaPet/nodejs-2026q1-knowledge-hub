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
@Injectable()
export class ArticlesService {
  constructor(
    @Inject(forwardRef(() => CommentsService))
    private readonly commentService: CommentsService,
  ) {}

  private articles: Article[] = [];
  create(createArticleDto: CreateArticleDto) {
    const article: Article = {
      id: randomUUID(),
      title: createArticleDto.title,
      content: createArticleDto.content,
      authorId: createArticleDto.authorId,
      status: createArticleDto.status ?? 'draft',
      categoryId: createArticleDto.categoryId,
      tags: createArticleDto.tags ?? [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.articles.push(article);
    return article;
  }

  findAll(query: GetArticlesQueryDto): Article[] {
    const { authorId, title, status, categoryId, tags, limit, offset } = query;

    let result = [...this.articles];

    if (authorId !== undefined) {
      result = result.filter((article) => article.authorId === authorId);
    }

    if (title) {
      const search = title.toLowerCase();
      result = result.filter((article) =>
        article.title.toLowerCase().includes(search),
      );
    }

    if (status) {
      result = result.filter((article) => article.status === status);
    }

    if (categoryId) {
      result = result.filter((article) => article.categoryId === categoryId);
    }

    if (tags && tags.length > 0) {
      result = result.filter((article) =>
        article.tags.some((tag) => tags.includes(tag)),
      );
    }

    const safeOffset = offset && offset > 0 ? offset : 0;
    const safeLimit = limit && limit > 0 ? limit : result.length;

    result = result.slice(safeOffset, safeOffset + safeLimit);

    return result;
  }

  findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const article = this.articles.find((art) => id.toString() === art.id);
    if (!article) {
      throw new NotFoundException("User don't found");
    }
    return article;
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const article = this.articles.find((art) => id.toString() === art.id);
    if (!article) {
      throw new NotFoundException('User not found');
    }
    Object.assign(article, updateArticleDto);
    return article;
  }

  remove(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid articleId');
    }

    const index = this.articles.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new NotFoundException('Article not found');
    }

    this.commentService.deleteByArticle(id);

    this.articles.splice(index, 1);
  }

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
}
