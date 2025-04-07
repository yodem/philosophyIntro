import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';
import { ContentType } from '../entities/content.entity';

interface RelatedContent {
  id: string;
  title: string;
  type: string;
}

export class UpdateContentDto {
  @ApiPropertyOptional({
    description: 'Updated title of the content',
    example: "Plato's Republic (Revised)",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated content of the content',
    example: '<p>Some HTML content</p>',
  })
  @IsOptional()
  @IsString()
  content?: string;

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
    description: 'Updated URL for the full picture',
    example: 'https://example.com/full.jpg',
  })
  @IsOptional()
  @IsString()
  full_picture?: string;

  @ApiPropertyOptional({
    description: 'Updated URL for the description picture',
    example: 'https://example.com/description.jpg',
  })
  @IsOptional()
  @IsString()
  description_picture?: string;

  @ApiPropertyOptional({
    description: 'Updated list of philosophers',
    type: [Object],
    example: [
      { id: '123', title: 'Philosopher 1', type: 'philosopher' },
      { id: '456', title: 'Philosopher 2', type: 'philosopher' },
    ],
  })
  @IsOptional()
  @IsArray()
  philosopher?: RelatedContent[];

  @ApiPropertyOptional({
    description: 'Updated list of terms',
    type: [Object],
    example: [
      { id: '789', title: 'Term 1', type: 'term' },
      { id: '101', title: 'Term 2', type: 'term' },
    ],
  })
  @IsOptional()
  @IsArray()
  term?: RelatedContent[];
  @ApiPropertyOptional({
    description: 'Updated list of questions',
    type: [Object],
    example: [
      { id: '789', title: 'Term 1', type: 'question' },
      { id: '101', title: 'Term 2', type: 'question' },
    ],
  })
  @IsOptional()
  @IsArray()
  question?: RelatedContent[];
}
