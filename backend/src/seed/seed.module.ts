import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Term } from '@/term/entities/term.entity';
import { Question } from '@/question/entities/question.entity';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Term, Question, Philosopher])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
