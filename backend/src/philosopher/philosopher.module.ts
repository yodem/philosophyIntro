import { Module } from '@nestjs/common';
import { PhilosopherService } from './philosopher.service';
import { PhilosopherController } from './philosopher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';

@Module({
  controllers: [PhilosopherController],
  imports: [TypeOrmModule.forFeature([Philosopher])],
  providers: [PhilosopherService],
})
export class PhilosopherModule {}
