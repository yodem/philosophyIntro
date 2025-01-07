import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PhilosopherService } from './philosopher.service';
import { CreatePhilosopherDto } from './dto/create-philosopher.dto';
import { UpdatePhilosopherDto } from './dto/update-philosopher.dto';

@Controller('philosophers')
export class PhilosopherController {
  constructor(private readonly philosopherService: PhilosopherService) {}

  @Post()
  create(@Body() createPhilosopherDto: CreatePhilosopherDto) {
    return this.philosopherService.create(createPhilosopherDto);
  }

  @Get()
  findAll() {
    return this.philosopherService.findAll();
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
