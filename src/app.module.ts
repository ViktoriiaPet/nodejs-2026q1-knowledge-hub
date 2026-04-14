import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { PrismaModule } from 'prisma/PrismaModule';

@Module({
  imports: [PrismaModule, UsersModule, ArticlesModule, CategoriesModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
