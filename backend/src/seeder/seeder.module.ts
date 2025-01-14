import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Term } from '../term/entities/term.entity';
import { Philosopher } from '../philosopher/entities/philosopher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Term, Philosopher])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
