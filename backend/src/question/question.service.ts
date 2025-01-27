import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions, ILike } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { Term } from '../term/entities/term.entity';
import { Philosopher } from '../philosopher/entities/philosopher.entity';
import { PaginatedResponse } from '@/types/pagination.types';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    this.logger.log('Creating a new question');
    try {
      const {
        associatedTerms,
        associatedQuestions,
        associatedPhilosophers,
        ...questionData
      } = createQuestionDto;
      const question = this.questionRepository.create(questionData);

      if (associatedTerms) {
        question.associatedTerms = await this.termRepository.findBy({
          id: In(associatedTerms),
        });
      }

      if (associatedQuestions) {
        question.associatedQuestions = await this.questionRepository.findBy({
          id: In(associatedQuestions),
        });
      }

      if (associatedPhilosophers) {
        question.associatedPhilosophers =
          await this.philosopherRepository.findBy({
            id: In(associatedPhilosophers),
          });
      }

      return this.questionRepository.save(question);
    } catch (error) {
      this.logger.error('Failed to create question', error.stack);
      throw new InternalServerErrorException('Failed to create question');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<PaginatedResponse<Question>> {
    this.logger.log(`Pagination params - Page: ${page}, Limit: ${limit}`);
    if (search) {
      this.logger.log(`Search term: "${search}"`);
    }

    const options: FindManyOptions<Question> = {
      relations: [
        'associatedTerms',
        'associatedQuestions',
        'associatedPhilosophers',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        title: 'ASC',
      },
    };

    if (search) {
      options.where = {
        title: ILike(`%${search}%`),
      };
    }

    const [items, total] = await this.questionRepository.findAndCount(options);
    this.logger.log(
      `Found ${items.length} items out of ${total} total records`,
    );

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Question> {
    this.logger.log(`Fetching question with ID ${id}`);
    try {
      const question = await this.questionRepository.findOne({
        where: { id },
        relations: [
          'associatedTerms',
          'associatedQuestions',
          'associatedPhilosophers',
        ],
      });
      if (!question) {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }
      return question;
    } catch (error) {
      this.logger.error(`Failed to fetch question with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to fetch question with ID ${id}`,
      );
    }
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    this.logger.log(`Updating question with ID ${id}`);
    try {
      const {
        associatedTerms,
        associatedQuestions,
        associatedPhilosophers,
        ...questionData
      } = updateQuestionDto;

      await this.questionRepository.update({ id }, questionData);
      const question = await this.findOne(id);

      if (associatedTerms) {
        question.associatedTerms = await this.termRepository.findBy({
          id: In(associatedTerms),
        });
      }

      if (associatedQuestions) {
        question.associatedQuestions = await this.questionRepository.findBy({
          id: In(associatedQuestions),
        });
      }

      if (associatedPhilosophers) {
        question.associatedPhilosophers =
          await this.philosopherRepository.findBy({
            id: In(associatedPhilosophers),
          });
      }

      return this.questionRepository.save(question);
    } catch (error) {
      this.logger.error(`Failed to update question with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to update question with ID ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing question with ID ${id}`);
    try {
      await this.questionRepository.delete(id);
    } catch (error) {
      this.logger.error(`Failed to remove question with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to remove question with ID ${id}`,
      );
    }
  }
}
