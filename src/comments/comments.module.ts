import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { forwardRef } from '@nestjs/common';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [forwardRef(() => ArticlesModule)],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
