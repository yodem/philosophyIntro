import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Content } from '../content/entities/content.entity';
import { ContentRelationship } from '../content/entities/contentRelationship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content, ContentRelationship])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
