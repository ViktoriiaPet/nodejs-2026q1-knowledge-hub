import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import type { Article } from 'src/types';
import { randomUUID } from 'node:crypto';
import { ArticlesModule } from './articles.module';
@Injectable()
export class ArticlesService {
  private articles: Article[] = []
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

  findAll() {
    return this.articles
  }

  findOne(id: number) {
         const article = this.articles.find(user => id.toString() === user.id)
            if(!article) {
              throw new NotFoundException("User don't found")
            }
            return article
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
     const article = this.articles.find(art => id.toString() === art.id)
    if (!article) {
      throw new NotFoundException ('User not found')
    }
     Object.assign(article, updateArticleDto);
    return article
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
