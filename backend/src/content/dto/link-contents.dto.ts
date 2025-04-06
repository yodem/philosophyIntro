import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class LinkContentsDto {
  @ApiProperty({
    description: 'ID of the first content item',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID(4)
  contentId1: string;

  @ApiProperty({
    description: 'ID of the second content item',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID(4)
  contentId2: string;
}
