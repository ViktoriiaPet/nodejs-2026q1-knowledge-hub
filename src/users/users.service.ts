import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from 'src/types';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersService {
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
