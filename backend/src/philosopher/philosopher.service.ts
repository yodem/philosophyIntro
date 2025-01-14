import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePhilosopherDto } from './dto/create-philosopher.dto';
import { UpdatePhilosopherDto } from './dto/update-philosopher.dto';
import { Philosopher } from './entities/philosopher.entity';
import { Term } from '../term/entities/term.entity';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class PhilosopherService {
  private readonly logger = new Logger(PhilosopherService.name);

  constructor(
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(
    createPhilosopherDto: CreatePhilosopherDto,
  ): Promise<Philosopher> {
    this.logger.log('Creating a new philosopher');
    try {
      const {
        associatedTerms,
        associatedQuestions,
        associatedPhilosophers,
        ...philosopherData
      } = createPhilosopherDto;
      const philosopher = this.philosopherRepository.create(philosopherData);

      if (associatedTerms) {
        philosopher.associatedTerms = await this.termRepository.findBy({
          id: In(associatedTerms),
        });
      }

      if (associatedQuestions) {
        philosopher.associatedQuestions = await this.questionRepository.findBy({
          id: In(associatedQuestions),
        });
      }

      if (associatedPhilosophers) {
        philosopher.associatedPhilosophers =
          await this.philosopherRepository.findBy({
            id: In(associatedPhilosophers),
          });
      }

      return this.philosopherRepository.save(philosopher);
    } catch (error) {
      this.logger.error('Failed to create philosopher', error.stack);
      throw new InternalServerErrorException('Failed to create philosopher');
    }
  }

  findAll(): Promise<Philosopher[]> {
    this.logger.log('Fetching all philosophers');
    return this.philosopherRepository.find({
      relations: [
        'associatedTerms',
        'associatedQuestions',
        'associatedPhilosophers',
      ],
    });
  }

  async findOne(id: string): Promise<Philosopher> {
    this.logger.log(`Fetching philosopher with ID ${id}`);
    try {
      const philosopher = await this.philosopherRepository.findOne({
        where: { id },
        relations: [
          'associatedTerms',
          'associatedQuestions',
          'associatedPhilosophers',
        ],
      });
      if (!philosopher) {
        throw new NotFoundException(`Philosopher with ID ${id} not found`);
      }
      return philosopher;
    } catch (error) {
      this.logger.error(
        `Failed to fetch philosopher with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to fetch philosopher with ID ${id}`,
      );
    }
  }

  async update(
    id: string,
    updatePhilosopherDto: UpdatePhilosopherDto,
  ): Promise<Philosopher> {
    this.logger.log(`Updating philosopher with ID ${id}`);
    try {
      const {
        associatedTerms,
        associatedQuestions,
        associatedPhilosophers,
        ...philosopherData
      } = updatePhilosopherDto;

      await this.philosopherRepository.update({ id }, philosopherData);

      // Load existing philosopher with relations
      const philosopher = await this.philosopherRepository.findOne({
        where: { id },
        relations: [
          'associatedTerms',
          'associatedQuestions',
          'associatedPhilosophers',
        ],
      });

      if (!philosopher) {
        throw new NotFoundException(`Philosopher with ID ${id} not found`);
      }

      if (associatedTerms) {
        // Load the terms
        const terms = await this.termRepository.findBy({
          id: In(associatedTerms),
        });

        // Update the association
        philosopher.associatedTerms = terms;
      }

      if (associatedQuestions) {
        const questions = await this.questionRepository.findBy({
          id: In(associatedQuestions),
        });
        philosopher.associatedQuestions = questions;
      }

      if (associatedPhilosophers) {
        const philosophers = await this.philosopherRepository.findBy({
          id: In(associatedPhilosophers),
        });
        philosopher.associatedPhilosophers = philosophers;
      }

      // Save the updated philosopher with its relations
      return this.philosopherRepository.save(philosopher);
    } catch (error) {
      this.logger.error(
        `Failed to update philosopher with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to update philosopher with ID ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing philosopher with ID ${id}`);
    try {
      await this.philosopherRepository.delete(id);
    } catch (error) {
      this.logger.error(
        `Failed to remove philosopher with ID ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to remove philosopher with ID ${id}`,
      );
    }
  }
}
