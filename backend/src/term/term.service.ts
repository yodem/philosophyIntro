import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { Term } from './entities/term.entity';
import { Philosopher } from '../philosopher/entities/philosopher.entity';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createTermDto: CreateTermDto): Promise<Term> {
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
  }

  findAll(): Promise<Term[]> {
    return this.termRepository.find({
      relations: [
        'associatedTerms',
        'associatedQuestions',
        'associatedPhilosophers',
      ],
    });
  }

  async findOne(id: string): Promise<Term> {
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
  }

  async update(id: string, updateTermDto: UpdateTermDto): Promise<Term> {
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
  }

  async remove(id: string): Promise<void> {
    await this.termRepository.delete(id);
  }
}
