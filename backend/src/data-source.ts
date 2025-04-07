import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password1',
  database: process.env.DATABASE_NAME || 'philosophy',
  migrations: ['src/migrations/*{.js,.ts}'], // Changed from dist to src
  entities: ['src/**/*.entity{.js,.ts}'], // Changed from dist to src
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  logging: true, // Add logging for better debugging
};

export const AppDataSource = new DataSource(options);
