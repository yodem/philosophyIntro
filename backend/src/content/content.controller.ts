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
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { LinkContentsDto } from './dto/link-contents.dto';
import { SearchParamsDto } from '../types/pagination.types';
import { ContentType } from './entities/content.entity';

@Controller('content')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(@Body() dto: CreateContentDto) {
    this.logger.log('Creating new content');
    return this.contentService.create(dto);
  }

  @Get()
  findAll(@Query() searchParams: SearchParamsDto) {
    const { page = 1, limit = 10, search, type } = searchParams;
    this.logger.log(
      `Finding all content with params: ${JSON.stringify(searchParams)}`,
    );
    return this.contentService.findAll(page, limit, search, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Finding content with id: ${id}`);
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    this.logger.log(`Updating content with id: ${id}`);
    return this.contentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing content with id: ${id}`);
    return this.contentService.remove(id);
  }

  @Post('relationship')
  link(@Body() dto: LinkContentsDto) {
    this.logger.log(
      `Linking content: ${dto.contentId1} with ${dto.contentId2}`,
    );
    return this.contentService.linkContents(dto);
  }

  @Get(':id/related')
  findRelated(@Param('id') id: string, @Query('type') type?: ContentType) {
    this.logger.log(
      `Finding related content for id: ${id} with type filter: ${type || 'none'}`,
    );
    return this.contentService.findRelated(id, type);
  }
}
