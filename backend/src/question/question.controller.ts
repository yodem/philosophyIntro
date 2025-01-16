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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PaginatedResponse, SearchParams } from '@/types/pagination.types';
import { Question } from './entities/question.entity';

@Controller('questions')
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);

  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    this.logger.log('Creating a new question');
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findAll(
    @Query() searchParams: SearchParams,
  ): Promise<PaginatedResponse<Question>> {
    const { page = 1, limit = 10, search } = searchParams;
    this.logger.log(
      `Fetching all questions with pagination and search: ${search}`,
    );
    return this.questionService.findAll(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Fetching question with ID ${id}`);
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    this.logger.log(`Updating question with ID ${id}`);
    return this.questionService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing question with ID ${id}`);
    return this.questionService.remove(id);
  }
}
