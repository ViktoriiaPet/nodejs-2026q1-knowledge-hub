import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from 'src/types';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';
import { ArticlesService } from 'src/articles/articles.service';
import { CommentsService } from 'src/comments/comments.service';
import { UserWithoutPassword } from 'src/types';
import { PrismaService } from 'prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly articleService: ArticlesService,
    private readonly commentService: CommentsService,
  ) {}

  private users: User[] = [];
async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
  const user = await this.prisma.user.create({
    data: {
      login: createUserDto.login,
      password: createUserDto.password,
      role: createUserDto.role ?? 'viewer',
    },
  });

  return {
    id: user.id,
    login: user.login,
    role: user.role,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
  };
}

  findAll() {
    return this.prisma.user.findMany();
  }

async findOne(id: string): Promise<UserWithoutPassword> {
  const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException("User don't found");
  }

  return {
    id: user.id,
    login: user.login,
    role: user.role,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
  };
}

async update(id: string, dto: UpdateUserDto): Promise<UserWithoutPassword> {
  const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) throw new NotFoundException('User not found');
  if (user.password !== dto.oldPassword) {
    throw new ForbiddenException('Wrong password');
  }

  const updated = await this.prisma.user.update({
    where: { id },
    data: { password: dto.newPassword },
  });

  return {
    id: updated.id,
    login: updated.login,
    role: updated.role,
    createdAt: updated.createdAt.getTime(),
    updatedAt: updated.updatedAt.getTime(),
  };
}

  async remove(id: string): Promise<void> {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException('User not found');

  await this.prisma.comment.deleteMany({
    where: { authorId: id },
  });

  await this.prisma.article.updateMany({
    where: { authorId: id },
    data: { authorId: null },
  });

  await this.prisma.user.delete({ where: { id } });
}
}
