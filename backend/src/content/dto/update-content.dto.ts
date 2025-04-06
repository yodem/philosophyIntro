import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsObject,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ContentType } from '../entities/content.entity';

export class UpdateContentDto {
  @ApiPropertyOptional({
    description: 'Updated title of the content',
    example: "Plato's Republic (Revised)",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated type of the content',
    enum: ContentType,
    example: 'BOOK',
  })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({
    description: 'Updated description of the content',
    example: 'A comprehensive philosophical work by Plato',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated metadata for the content',
    example: { author: 'Plato', year: '380 BCE', edition: 'Third' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'IDs of related content to link',
    type: [String],
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  relatedContentIds?: string[];
}
