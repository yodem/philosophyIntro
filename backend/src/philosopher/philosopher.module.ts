import { Module } from '@nestjs/common';
import { PhilosopherService } from './philosopher.service';
import { PhilosopherController } from './philosopher.controller';

@Module({
  controllers: [PhilosopherController],
  providers: [PhilosopherService],
})
export class PhilosopherModule {}
