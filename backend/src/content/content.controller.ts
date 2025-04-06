import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { LinkContentsDto } from './dto/link-contents.dto';
import { SearchParamsDto } from '../types/pagination.types';
import { ContentType } from './entities/content.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Content')
@ApiBearerAuth()
@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({
    status: 201,
    description: 'The content has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  create(@Body() dto: CreateContentDto) {
    this.logger.log('Creating new content');
    return this.contentService.create(dto);
  }

  @ApiOperation({ summary: 'Get all content with pagination and search' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term',
    type: String,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Content type filter',
    enum: ContentType,
  })
  @ApiResponse({ status: 200, description: 'Returns paginated content list' })
  @Public()
  @Get()
  findAll(@Query() searchParams: SearchParamsDto) {
    const { page = 1, limit = 10, search, type } = searchParams;
    this.logger.log(
      `Finding all content with params: ${JSON.stringify(searchParams)}`,
    );
    return this.contentService.findAll(page, limit, search, type);
  }

  @ApiOperation({ summary: 'Get content by ID' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Returns the content item' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Finding content with id: ${id}`);
    return this.contentService.findOne(id);
  }

  @ApiOperation({ summary: 'Update content' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    this.logger.log(`Updating content with id: ${id}`);
    return this.contentService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete content' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing content with id: ${id}`);
    return this.contentService.remove(id);
  }

  @ApiOperation({ summary: 'Link two content items' })
  @ApiResponse({ status: 201, description: 'Content linked successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @Post('relationship')
  link(@Body() dto: LinkContentsDto) {
    this.logger.log(
      `Linking content: ${dto.contentId1} with ${dto.contentId2}`,
    );
    return this.contentService.linkContents(dto);
  }

  @ApiOperation({ summary: 'Get related content' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by content type',
    enum: ContentType,
  })
  @ApiResponse({ status: 200, description: 'Returns list of related content' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @Public()
  @Get(':id/related')
  findRelated(@Param('id') id: string, @Query('type') type?: ContentType) {
    this.logger.log(
      `Finding related content for id: ${id} with type filter: ${type || 'none'}`,
    );
    return this.contentService.findRelated(id, type);
  }
}
