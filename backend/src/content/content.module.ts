import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentRelationship } from './entities/contentRelationship.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Content, ContentRelationship])],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
