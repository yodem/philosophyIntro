import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  MetadataService,
  MetadataDefinition,
  ContentTypeInfo,
} from './metadata.service';
import { ContentType } from '@/content/entities/content.entity';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { MetadataSchema } from './entities/metadata-schema.entity';
import { Public } from '@/auth/decorators/public.decorator';

@ApiTags('Metadata')
@ApiBearerAuth()
@Controller('metadata')
@UseGuards(JwtAuthGuard)
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @ApiOperation({ summary: 'Get all content types' })
  @ApiResponse({
    status: 200,
    description: 'Returns all content types with display names',
  })
  @Public()
  @Get('types')
  getContentTypes(): ContentTypeInfo[] {
    return this.metadataService.getAllContentTypes();
  }

  @ApiOperation({ summary: 'Get metadata schema for a content type' })
  @ApiParam({ name: 'type', description: 'Content type', enum: ContentType })
  @ApiResponse({
    status: 200,
    description: 'Returns metadata schema for the specified content type',
  })
  @ApiResponse({ status: 404, description: 'Content type not found' })
  @Public()
  @Get('schema/:type')
  async getMetadataSchema(
    @Param('type') type: ContentType,
  ): Promise<MetadataDefinition[]> {
    return this.metadataService.getMetadataSchema(type);
  }

  @ApiOperation({ summary: 'Add or update metadata schema for a content type' })
  @ApiParam({ name: 'type', description: 'Content type', enum: ContentType })
  @ApiResponse({
    status: 201,
    description: 'The metadata schema has been successfully created/updated',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('schema/:type')
  async upsertMetadataSchema(
    @Param('type') type: ContentType,
    @Body()
    schemaDefinition: Omit<MetadataSchema, 'id' | 'contentType'> & {
      id?: string;
    },
  ): Promise<MetadataSchema> {
    return this.metadataService.upsertMetadataSchema(type, schemaDefinition);
  }

  @ApiOperation({ summary: 'Delete a metadata schema' })
  @ApiParam({ name: 'id', description: 'Schema ID' })
  @ApiResponse({
    status: 200,
    description: 'The metadata schema has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  @Delete('schema/:id')
  async deleteMetadataSchema(@Param('id') id: string): Promise<void> {
    return this.metadataService.deleteMetadataSchema(id);
  }

  @ApiOperation({ summary: 'Get all metadata keys' })
  @ApiResponse({ status: 200, description: 'Returns all metadata keys' })
  @Public()
  @Get('keys')
  async getMetadataKeys(@Query('type') type?: ContentType): Promise<string[]> {
    return this.metadataService.getMetadataKeys(type);
  }
}
