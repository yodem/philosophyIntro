import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '@/question/entities/question.entity';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Term } from '@/term/entities/term.entity';

@Module({
  controllers: [QuestionController],
  imports: [TypeOrmModule.forFeature([Question, Philosopher, Term])],
  providers: [QuestionService],
})
export class QuestionModule {}
