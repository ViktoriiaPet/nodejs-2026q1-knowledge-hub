import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { Comment } from 'src/types';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { ArticlesService } from 'src/articles/articles.service';
import { forwardRef } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(forwardRef(() => ArticlesService))
    private readonly articleService: ArticlesService,
  ) {}
  private comments: Comment[] = [];
  create(createCommentDto: CreateCommentDto): Comment {
    const comment: Comment = {
      id: randomUUID(),
      content: createCommentDto.content,
      articleId: createCommentDto.articleId,
      authorId: createCommentDto.authorId,
      createdAt: Date.now(),
    };
    if (!isUUID(comment.articleId)) {
      throw new BadRequestException('Invalid id');
    }

    this.comments.push(comment);
    return comment;
  }

  findAll() {
    return this.comments;
  }

  findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const comment = this.comments.find((user) => id.toString() === user.id);
    if (!comment) {
      throw new NotFoundException("User don't found");
    }
    return comment;
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = this.comments.find((com) => id.toString() === com.id);
    if (!comment) {
      throw new NotFoundException('Comment is not found');
    }
    if (!updateCommentDto.content) {
      throw new NotFoundException('Content is not found');
    }
    Object.assign(comment, updateCommentDto);
    return comment;
  }

  remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid commentId');
    }

    const index = this.comments.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new NotFoundException('Comment not found');
    }

    this.comments.splice(index, 1);
  }

  deleteByUser(userId: string) {
    this.comments = this.comments.filter((c) => c.authorId !== userId);
  }

  deleteByArticle(articleId: string) {
    this.comments = this.comments.filter((c) => c.articleId !== articleId);
  }
}
