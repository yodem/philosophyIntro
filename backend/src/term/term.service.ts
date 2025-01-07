import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { Term } from './entities/term.entity';
import { Question } from '../question/entities/question.entity';
import { Philosopher } from '../philosopher/entities/philosopher.entity';

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
  ) {}

  async create(createTermDto: CreateTermDto): Promise<Term> {
    const { philosophers, questions, ...termData } = createTermDto;

    const term = this.termRepository.create(termData);

    if (philosophers) {
      const philosopherEntities = await this.philosopherRepository.findBy({
        id: In(philosophers),
      });
      term.philosophers = philosopherEntities;
    }

    if (questions) {
      const questionEntities = await this.questionRepository.findBy({
        id: In(questions),
      });
      term.questions = questionEntities;
    }

    return this.termRepository.save(term);
  }

  findAll(): Promise<Term[]> {
    return this.termRepository.find();
  }

  async findOne(id: number): Promise<Term> {
    const term = await this.termRepository.findOne({
      where: { id },
      relations: ['philosophers', 'questions'],
    });
    if (!term) {
      throw new Error(`Term with ID ${id} not found`);
    }
    return term;
  }

  async update(id: number, updateTermDto: UpdateTermDto): Promise<Term> {
    const { questions, philosophers, ...termData } = updateTermDto;

    await this.termRepository.update({ id }, termData);
    const updatedTerm = await this.termRepository.findOne({
      where: { id },
    });

    if (!updatedTerm) {
      throw new Error(`Term with ID ${id} not found`);
    }

    if (questions) {
      const questionEntities = await this.questionRepository.findBy({
        id: In(questions),
      });
      updatedTerm.questions = questionEntities;
    }

    if (philosophers) {
      const philosopherEntities = await this.philosopherRepository.findBy({
        id: In(philosophers),
      });
      updatedTerm.philosophers = philosopherEntities;
    }

    return this.termRepository.save(updatedTerm);
  }

  async remove(id: number): Promise<void> {
    await this.termRepository.delete(id);
  }
}
