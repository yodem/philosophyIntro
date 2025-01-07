import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '@/question/entities/question.entity';

@Module({
  controllers: [QuestionController],
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionService],
})
export class QuestionModule {}
