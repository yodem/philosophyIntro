import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { SeedService } from '@/seed/seed.service';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseInitService implements OnApplicationShutdown {
  constructor(
    private readonly seedService: SeedService,
    private readonly dataSource: DataSource,
  ) {}

  async init() {
    await this.seedService.seed();
  }

  async onApplicationShutdown() {
    // Drop all tables
    await this.dataSource.dropDatabase();
    await this.dataSource.destroy();
  }
}
