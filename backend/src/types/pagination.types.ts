import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { ContentType } from '../content/entities/content.entity';

export class SearchParamsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search term to filter results',
    example: 'Plato',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Content type to filter results',
    enum: ContentType,
  })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;
}

export class PaginatedResponse<T> {
  @ApiProperty({ description: 'List of items' })
  items: T[];

  @ApiProperty({ description: 'Total number of items', type: Number })
  total: number;

  @ApiProperty({ description: 'Current page', type: Number })
  page: number;

  @ApiProperty({ description: 'Number of items per page', type: Number })
  limit: number;
}
