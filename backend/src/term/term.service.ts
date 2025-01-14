import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { Term } from './entities/term.entity';
import { Philosopher } from '../philosopher/entities/philosopher.entity';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class TermService {
  private readonly logger = new Logger(TermService.name);

  constructor(
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createTermDto: CreateTermDto): Promise<Term> {
    this.logger.log('Creating a new term');
    try {
      const {
        associatedTerms,
        associatedQuestions,
        associatedPhilosophers,
        ...termData
      } = createTermDto;
      const term = this.termRepository.create(termData);

      if (associatedTerms) {
        term.associatedTerms = await this.termRepository.findBy({
          id: In(associatedTerms),
        });
      }

      if (associatedQuestions) {
        term.associatedQuestions = await this.questionRepository.findBy({
          id: In(associatedQuestions),
        });
      }

      if (associatedPhilosophers) {
        term.associatedPhilosophers = await this.philosopherRepository.findBy({
          id: In(associatedPhilosophers),
        });
      }

      return this.termRepository.save(term);
    } catch (error) {
      this.logger.error('Failed to create term', error.stack);
      throw new InternalServerErrorException('Failed to create term');
    }
  }

  findAll(): Promise<Term[]> {
    this.logger.log('Fetching all terms');
    return this.termRepository.find({
      relations: [
        'associatedTerms',
        'associatedQuestions',
        'associatedPhilosophers',
      ],
    });
  }

  async findOne(id: string): Promise<Term> {
    this.logger.log(`Fetching term with ID ${id}`);
    try {
      const term = await this.termRepository.findOne({
        where: { id },
        relations: [
          'associatedTerms',
          'associatedQuestions',
          'associatedPhilosophers',
        ],
      });
      if (!term) {
        throw new NotFoundException(`Term with ID ${id} not found`);
      }
      return term;
    } catch (error) {
      this.logger.error(`Failed to fetch term with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to fetch term with ID ${id}`,
      );
    }
  }

  async update(id: string, updateTermDto: UpdateTermDto): Promise<Term> {
    this.logger.log(`Updating term with ID ${id}`);
    try {
      const {
        associatedTerms,
        associatedQuestions,
        associatedPhilosophers,
        ...termData
      } = updateTermDto;

      await this.termRepository.update({ id }, termData);
      const term = await this.findOne(id);

      if (associatedTerms) {
        term.associatedTerms = await this.termRepository.findBy({
          id: In(associatedTerms),
        });
      }

      if (associatedQuestions) {
        term.associatedQuestions = await this.questionRepository.findBy({
          id: In(associatedQuestions),
        });
      }

      if (associatedPhilosophers) {
        term.associatedPhilosophers = await this.philosopherRepository.findBy({
          id: In(associatedPhilosophers),
        });
      }

      return this.termRepository.save(term);
    } catch (error) {
      this.logger.error(`Failed to update term with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to update term with ID ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing term with ID ${id}`);
    try {
      await this.termRepository.delete(id);
    } catch (error) {
      this.logger.error(`Failed to remove term with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to remove term with ID ${id}`,
      );
    }
  }
}
