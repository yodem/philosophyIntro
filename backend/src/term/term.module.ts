import { Module } from '@nestjs/common';
import { TermService } from './term.service';
import { TermController } from './term.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Term } from '@/term/entities/term.entity';

@Module({
  controllers: [TermController],
  imports: [TypeOrmModule.forFeature([Term])],
  providers: [TermService],
})
export class TermModule {}
