import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseInitService } from './database/database-init.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize database with seed data
  const databaseInitService = app.get(DatabaseInitService);
  app.enableCors();
  await databaseInitService.init();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
