import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ArticlesModule } from 'src/articles/articles.module';
import { CommentsModule } from 'src/comments/comments.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => ArticlesModule), forwardRef(() => CommentsModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
