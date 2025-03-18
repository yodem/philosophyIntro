import {
  IsOptional,
  IsString,
  IsObject,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ContentMetadata } from '../entities/content.entity';

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

  @IsString()
  @IsOptional()
  full_picture?: string;

  @IsString()
  @IsOptional()
  description_picture?: string;

  @IsOptional()
  @IsObject()
  metadata?: ContentMetadata;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  relatedContentIds?: string[];
}
