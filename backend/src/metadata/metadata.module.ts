import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetadataService } from './metadata.service';
import { MetadataSchema } from './entities/metadata-schema.entity';
import { MetadataController } from '@/metadata/metadata.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MetadataSchema])],
  providers: [MetadataService],
  controllers: [MetadataController],
  exports: [MetadataService],
})
export class MetadataModule {}
