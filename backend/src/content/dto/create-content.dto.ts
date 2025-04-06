import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ContentType } from '../entities/content.entity';

export class CreateContentDto {
  @ApiProperty({
    description: 'Title of the content',
    example: "Plato's Republic",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Type of the content',
    enum: ContentType,
    example: 'BOOK',
  })
  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType;

  @ApiPropertyOptional({
    description: 'Description of the content',
    example:
      'A philosophical work by Plato that discusses justice and the ideal state',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the content',
    example: { author: 'Plato', year: '380 BCE' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
