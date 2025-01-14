import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { PhilosopherService } from './philosopher.service';
import { CreatePhilosopherDto } from './dto/create-philosopher.dto';
import { UpdatePhilosopherDto } from './dto/update-philosopher.dto';

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
  findAll() {
    this.logger.log('Fetching all philosophers');
    return this.philosopherService.findAll();
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
