import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Category } from 'src/types';
import { randomUUID } from 'node:crypto';
import { strict } from 'node:assert';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoriesService {
  private categories: Category[] = []
  create(createCategoryDto: CreateCategoryDto) : Category {
    const category: Category = {
      id: randomUUID(),
      name: createCategoryDto.name,
      description: createCategoryDto.description
    }
    this.categories.push(category)
    return category
  }

  findAll() {
    return this.categories;
  }

  findOne(id: number) {
     const category = this.categories.find(user => id.toString() === user.id)
        if(!category) {
          throw new NotFoundException("User don't found")
        }
        return category
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = this.categories.find(cat => id === cat.id)
    if (!category) {
      throw new NotFoundException ('User not found')
    }
    Object.assign(category, updateCategoryDto);
    
    return category
  }

  remove(id: string) : void {
     if (!isUUID(id)) {
    throw new BadRequestException('Invalid categoryId');
  }

  const index = this.categories.findIndex(c => c.id === id);

  if (index === -1) {
    throw new NotFoundException('Category not found');
  }

  this.categories.splice(index, 1);
  }
}
