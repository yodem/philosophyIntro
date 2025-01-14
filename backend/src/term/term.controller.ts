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
import { TermService } from './term.service';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';

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
  findAll() {
    this.logger.log('Fetching all terms');
    return this.termService.findAll();
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
