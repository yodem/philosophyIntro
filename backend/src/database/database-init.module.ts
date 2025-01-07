import { Module } from '@nestjs/common';
import { DatabaseInitService } from './database-init.service';
import { SeedModule } from '@/seed/seed.module';

@Module({
  imports: [SeedModule],
  providers: [DatabaseInitService],
  exports: [DatabaseInitService],
})
export class DatabaseInitModule {}
