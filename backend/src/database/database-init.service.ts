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
    await this.cleanup();
    await this.recreateDatabase();
    await this.seedService.seed();
  }

  private async cleanup() {
    try {
      await this.dataSource.dropDatabase();
    } catch (error) {
      console.warn('Error during database cleanup:', error);
    }
  }

  private async recreateDatabase() {
    await this.dataSource.synchronize(true);
  }

  async onApplicationShutdown() {
    await this.cleanup();
    await this.dataSource.destroy();
  }
}
