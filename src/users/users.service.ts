import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from 'src/types';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { ArticlesService } from 'src/articles/articles.service';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class UsersService {

    constructor(
    private readonly articleService: ArticlesService,
    private readonly commentService: CommentsService,
  ) {}


  private users: User[] = [];
  create(createUserDto: CreateUserDto): User {
    
    const user: User = {
    id: randomUUID(),
    login: createUserDto.login,
    password: createUserDto.password,
    role: createUserDto.role ?? 'viewer',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  this.users.push(user);
  return user;
  }

  findAll() {
    return this.users
  }

  findOne(id: number) {
    const user = this.users.find(user => id.toString() === user.id)
    if(!user) {
      throw new NotFoundException("User don't found")
    }
    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) : User {
    const user = this.users.find(user => id.toString() === user.id)
    if (!user) {
      throw new NotFoundException ('User not found')
    }
    user.password = updateUserDto.newPassword
    user.updatedAt = Date.now();
    return user
  }

  remove(id: string): void {
    if (!isUUID(id)) {
    throw new BadRequestException('Invalid userId');
  }

  const index = this.users.findIndex(u => u.id === id);

  if (index === -1) {
    throw new NotFoundException('User not found');
  }

  this.commentService.deleteByUser(id);

  this.articleService.nullifyAuthor(id);

  this.users.splice(index, 1);
}
}
