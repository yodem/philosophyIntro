import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhilosopherModule } from './philosopher/philosopher.module';
import { TermModule } from './term/term.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { Philosopher } from './philosopher/entities/philosopher.entity';
import { Term } from './term/entities/term.entity';
import { Question } from './question/entities/question.entity';
import { SeedModule } from './seed/seed.module';
import { DatabaseInitModule } from './database/database-init.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Philosopher, Term, Question],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PhilosopherModule,
    TermModule,
    UserModule,
    QuestionModule,
    SeedModule,
    DatabaseInitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
