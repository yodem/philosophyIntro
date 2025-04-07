import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentRelationship } from './entities/contentRelationship.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { MetadataService } from '../metadata/metadata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Content, ContentRelationship])],
  providers: [ContentService, MetadataService],
  controllers: [ContentController],
  exports: [ContentService, MetadataService],
})
export class ContentModule {}
