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
import { PhilosopherService } from './philosopher.service';
import { CreatePhilosopherDto } from './dto/create-philosopher.dto';
import { UpdatePhilosopherDto } from './dto/update-philosopher.dto';
import { PaginatedResponse, SearchParams } from '@/types/pagination.types';
import { Philosopher } from './entities/philosopher.entity';

@Controller('philosophers')
export class PhilosopherController {
  private readonly logger = new Logger(PhilosopherController.name);

  constructor(private readonly philosopherService: PhilosopherService) {}

  @Post()
  create(@Body() createPhilosopherDto: CreatePhilosopherDto) {
    this.logger.log('Creating a new philosopher');
    return this.philosopherService.create(createPhilosopherDto);
  }

  @Get()
  findAll(
    @Query() searchParams: SearchParams,
  ): Promise<PaginatedResponse<Philosopher>> {
    const { page = 1, limit = 10, search } = searchParams;
    this.logger.log(
      `Fetching all philosophers with pagination and search: ${search}`,
    );
    return this.philosopherService.findAll(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Fetching philosopher with ID ${id}`);
    return this.philosopherService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhilosopherDto: UpdatePhilosopherDto,
  ) {
    this.logger.log(`Updating philosopher with ID ${id}`);
    return this.philosopherService.update(id, updatePhilosopherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing philosopher with ID ${id}`);
    return this.philosopherService.remove(id);
  }
}
