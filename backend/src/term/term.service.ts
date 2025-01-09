import { Injectable } from '@nestjs/common';
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
    const { relatedPhilosophers, relatedQuestions, relatedTerms, ...termData } =
      createTermDto;

    const term = this.termRepository.create(termData);

    if (relatedPhilosophers) {
      term.relatedPhilosophers = await this.philosopherRepository.findBy({
        id: In(relatedPhilosophers),
      });
    }

    if (relatedQuestions) {
      term.relatedQuestions = await this.questionRepository.findBy({
        id: In(relatedQuestions),
      });
    }

    if (relatedTerms) {
      term.relatedTerms = await this.termRepository.findBy({
        id: In(relatedTerms),
      });
    }

    return this.termRepository.save(term);
  }

  findAll(): Promise<Term[]> {
    return this.termRepository.find({
      relations: ['relatedTerms', 'relatedQuestions', 'relatedPhilosophers'],
    });
  }

  async findOne(id: number): Promise<Term> {
    const term = await this.termRepository.findOne({
      where: { id },
      relations: ['relatedTerms', 'relatedQuestions', 'relatedPhilosophers'],
    });

    if (!term) {
      throw new Error(`Term with ID ${id} not found`);
    }

    return term;
  }

  async update(id: number, updateTermDto: UpdateTermDto): Promise<Term> {
    const { relatedTerms, relatedQuestions, relatedPhilosophers, ...termData } =
      updateTermDto;

    await this.termRepository.update({ id }, termData);
    const term = await this.findOne(id);

    if (!term) {
      throw new Error(`Term with ID ${id} not found`);
    }

    if (relatedPhilosophers) {
      term.relatedPhilosophers = await this.philosopherRepository.findBy({
        id: In(relatedPhilosophers),
      });
    }

    if (relatedQuestions) {
      term.relatedQuestions = await this.questionRepository.findBy({
        id: In(relatedQuestions),
      });
    }

    if (relatedTerms) {
      term.relatedTerms = await this.termRepository.findBy({
        id: In(relatedTerms),
      });
    }

    return this.termRepository.save(term);
  }

  async remove(id: number): Promise<void> {
    await this.termRepository.delete(id);
  }
}
