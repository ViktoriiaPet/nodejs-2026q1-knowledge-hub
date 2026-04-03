import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Category } from 'src/types';
import { randomUUID } from 'node:crypto';

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
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
