import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermService } from './term.service';
import { TermController } from './term.controller';
import { Term } from './entities/term.entity';
import { Philosopher } from '../philosopher/entities/philosopher.entity';
import { Question } from '../question/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Term, Philosopher, Question])],
  controllers: [TermController],
  providers: [TermService],
})
export class TermModule {}
