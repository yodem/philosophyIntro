import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';
import { Term } from '@/term/entities/term.entity';
import { SeedService } from '@/seed/seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Philosopher, Question, Term])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
