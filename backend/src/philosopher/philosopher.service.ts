import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePhilosopherDto } from './dto/create-philosopher.dto';
import { UpdatePhilosopherDto } from './dto/update-philosopher.dto';
import { Philosopher } from './entities/philosopher.entity';
import { Term } from '../term/entities/term.entity';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class PhilosopherService {
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
    const {
      relatedTerms,
      relatedQuestions,
      relatedPhilosophers,
      ...philosopherData
    } = createPhilosopherDto;
    const philosopher = this.philosopherRepository.create(philosopherData);

    if (relatedTerms) {
      philosopher.relatedTerms = await this.termRepository.findBy({
        id: In(relatedTerms),
      });
    }

    if (relatedQuestions) {
      philosopher.relatedQuestions = await this.questionRepository.findBy({
        id: In(relatedQuestions),
      });
    }

    if (relatedPhilosophers) {
      philosopher.relatedPhilosophers = await this.philosopherRepository.findBy(
        {
          id: In(relatedPhilosophers),
        },
      );
    }

    return this.philosopherRepository.save(philosopher);
  }

  findAll(): Promise<Philosopher[]> {
    return this.philosopherRepository.find({
      relations: ['relatedTerms', 'relatedQuestions', 'relatedPhilosophers'],
    });
  }

  async findOne(id: number): Promise<Philosopher> {
    const philosopher = await this.philosopherRepository.findOne({
      where: { id },
      relations: ['relatedTerms', 'relatedQuestions', 'relatedPhilosophers'],
    });
    if (!philosopher) {
      throw new NotFoundException(`Philosopher with ID ${id} not found`);
    }
    return philosopher;
  }

  async update(
    id: number,
    updatePhilosopherDto: UpdatePhilosopherDto,
  ): Promise<Philosopher> {
    const {
      relatedTerms,
      relatedQuestions,
      relatedPhilosophers,
      ...philosopherData
    } = updatePhilosopherDto;

    await this.philosopherRepository.update({ id }, philosopherData);
    const philosopher = await this.findOne(id);

    if (relatedTerms) {
      philosopher.relatedTerms = await this.termRepository.findBy({
        id: In(relatedTerms),
      });
    }

    if (relatedQuestions) {
      philosopher.relatedQuestions = await this.questionRepository.findBy({
        id: In(relatedQuestions),
      });
    }

    if (relatedPhilosophers) {
      philosopher.relatedPhilosophers = await this.philosopherRepository.findBy(
        {
          id: In(relatedPhilosophers),
        },
      );
    }

    return this.philosopherRepository.save(philosopher);
  }

  async remove(id: number): Promise<void> {
    await this.philosopherRepository.delete(id);
  }
}
