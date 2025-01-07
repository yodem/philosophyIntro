import { Module } from '@nestjs/common';
import { PhilosopherService } from './philosopher.service';
import { PhilosopherController } from './philosopher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';
import { Term } from '@/term/entities/term.entity';

@Module({
  controllers: [PhilosopherController],
  imports: [TypeOrmModule.forFeature([Philosopher, Question, Term])],
  providers: [PhilosopherService],
})
export class PhilosopherModule {}
