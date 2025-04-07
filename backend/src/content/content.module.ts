import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentRelationship } from './entities/contentRelationship.entity';
import { ContentMetadata } from './entities/content-metadata.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { MetadataModule } from '../metadata/metadata.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, ContentRelationship, ContentMetadata]),
    MetadataModule,
  ],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService],
})
export class ContentModule {}
