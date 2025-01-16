import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import { TermService } from './term.service';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { PaginatedResponse, SearchParams } from '@/types/pagination.types';
import { Term } from './entities/term.entity';

@Controller('terms')
export class TermController {
  private readonly logger = new Logger(TermController.name);

  constructor(private readonly termService: TermService) {}

  @Post()
  create(@Body() createTermDto: CreateTermDto) {
    this.logger.log('Creating a new term');
    return this.termService.create(createTermDto);
  }

  @Get()
  findAll(
    @Query() searchParams: SearchParams,
  ): Promise<PaginatedResponse<Term>> {
    const { page = 1, limit = 10, search } = searchParams;
    this.logger.log(`Fetching all terms with pagination and search: ${search}`);
    return this.termService.findAll(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Fetching term with ID ${id}`);
    return this.termService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTermDto: UpdateTermDto) {
    this.logger.log(`Updating term with ID ${id}`);
    return this.termService.update(id, updateTermDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing term with ID ${id}`);
    return this.termService.remove(id);
  }
}
