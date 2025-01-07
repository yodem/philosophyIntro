import { Injectable } from '@nestjs/common';
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
    const { terms, questions, ...philosopherData } = createPhilosopherDto;

    const termEntities = terms
      ? await this.termRepository.findBy({ id: In(terms) })
      : [];
    const questionEntities = questions
      ? await this.questionRepository.findBy({ id: In(questions) })
      : [];

    const philosopher = this.philosopherRepository.create({
      ...philosopherData,
      terms: termEntities,
      questions: questionEntities,
    });

    return this.philosopherRepository.save(philosopher);
  }

  findAll(): Promise<Philosopher[]> {
    return this.philosopherRepository.find();
  }

  async findOne(id: number): Promise<Philosopher> {
    const philosopher = await this.philosopherRepository.findOne({
      where: { id },
      relations: ['terms', 'questions'],
    });
    if (!philosopher) {
      throw new Error(`Philosopher with ID ${id} not found`);
    }
    return philosopher;
  }

  async update(
    id: number,
    updatePhilosopherDto: UpdatePhilosopherDto,
  ): Promise<Philosopher> {
    const { terms, questions, ...philosopherData } = updatePhilosopherDto;

    await this.philosopherRepository.update({ id }, philosopherData);
    const updatedPhilosopher = await this.philosopherRepository.findOne({
      where: { id },
    });

    if (!updatedPhilosopher) {
      throw new Error(`Philosopher with ID ${id} not found`);
    }

    if (terms) {
      const termEntities = await this.termRepository.findBy({ id: In(terms) });
      updatedPhilosopher.terms = termEntities;
    }

    if (questions) {
      const questionEntities = await this.questionRepository.findBy({
        id: In(questions),
      });
      updatedPhilosopher.questions = questionEntities;
    }

    return this.philosopherRepository.save(updatedPhilosopher);
  }

  async remove(id: number): Promise<void> {
    await this.philosopherRepository.delete(id);
  }
}
