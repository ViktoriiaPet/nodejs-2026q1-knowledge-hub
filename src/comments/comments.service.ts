import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { Comment } from 'src/types';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CommentsService {
  private comments: Comment[] = []
  create(createCommentDto: CreateCommentDto): Comment {
    const comment: Comment = {
      id: randomUUID(),
      content: createCommentDto.content,
      articleId: createCommentDto.articleId,
      authorId: createCommentDto.authorId,
      createdAt: Date.now()
    }
    this.comments.push(comment)
    return comment
  }

  findAll() {
    return this.comments
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
