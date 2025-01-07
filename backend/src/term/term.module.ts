import { Module } from '@nestjs/common';
import { TermService } from './term.service';
import { TermController } from './term.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Term } from '@/term/entities/term.entity';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';

@Module({
  controllers: [TermController],
  imports: [TypeOrmModule.forFeature([Term, Philosopher, Question])],
  providers: [TermService],
})
export class TermModule {}
