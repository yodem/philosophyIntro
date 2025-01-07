import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, In } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(createQuestionDto);
    return this.questionRepository.save(question);
  }

  findAll(
    search?: string,
    page?: number,
    limit?: number,
    period?: string[],
    affiliation?: string[],
  ): Promise<Question[]> {
    const options: FindManyOptions<Question> = {};
    const where: any = {};
    if (search) {
      where.text = Like(`%${search}%`);
    }
    if (period && period.length > 0) {
      where.philosophicalPeriod = In(period);
    }
    if (affiliation && affiliation.length > 0) {
      where.philosophicalAffiliation = In(affiliation);
    }
    options.where = where;
    if (page && limit) {
      options.skip = (page - 1) * limit;
      options.take = limit;
    }
    return this.questionRepository.find(options);
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    await this.questionRepository.update({ id }, updateQuestionDto);
    const updatedQuestion = await this.questionRepository.findOne({
      where: { id },
    });
    if (!updatedQuestion) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return updatedQuestion;
  }

  async remove(id: number): Promise<void> {
    await this.questionRepository.delete(id);
  }
}
