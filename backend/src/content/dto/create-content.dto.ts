import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ContentType, ContentMetadata } from '../entities/content.entity';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty() // Making description required
  description: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsOptional()
  @IsObject() // Ensure JSON object
  metadata?: ContentMetadata;
}
