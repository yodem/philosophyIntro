import {
  IsOptional,
  IsEnum,
  IsString,
  IsObject,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ContentType, ContentMetadata } from '../entities/content.entity';

export class UpdateContentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional() // Keep optional for updates
  description?: string;

  @IsEnum(ContentType)
  @IsOptional()
  type?: ContentType;

  @IsOptional()
  @IsObject()
  metadata?: ContentMetadata;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  relatedContentIds?: string[];
}
