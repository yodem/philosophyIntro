import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PhilosopherService } from './philosopher.service';
import { CreatePhilosopherDto } from './dto/create-philosopher.dto';
import { UpdatePhilosopherDto } from './dto/update-philosopher.dto';

@Controller('philosopher')
export class PhilosopherController {
  constructor(private readonly philosopherService: PhilosopherService) {}

  @Post()
  create(@Body() createPhilosopherDto: CreatePhilosopherDto) {
    return this.philosopherService.create(createPhilosopherDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('period') period?: string[],
    @Query('affiliation') affiliation?: string[],
  ) {
    return this.philosopherService.findAll(
      search,
      page,
      limit,
      period,
      affiliation,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.philosopherService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhilosopherDto: UpdatePhilosopherDto,
  ) {
    return this.philosopherService.update(+id, updatePhilosopherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.philosopherService.remove(+id);
  }
}
