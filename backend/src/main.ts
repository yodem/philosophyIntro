import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize database with seed data
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
