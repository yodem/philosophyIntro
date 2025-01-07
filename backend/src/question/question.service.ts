import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { Term } from '../term/entities/term.entity';
import { Philosopher } from '../philosopher/entities/philosopher.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const { philosophers, terms, ...questionData } = createQuestionDto;

    const question = this.questionRepository.create(questionData);

    if (philosophers) {
      const philosopherEntities = await this.philosopherRepository.findBy({
        id: In(philosophers),
      });
      question.philosophers = philosopherEntities;
    }

    if (terms) {
      const termEntities = await this.termRepository.findBy({ id: In(terms) });
      question.terms = termEntities;
    }

    return this.questionRepository.save(question);
  }

  findAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['terms', 'philosophers'],
    });
    if (!question) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const { terms, philosophers, ...questionData } = updateQuestionDto;

    await this.questionRepository.update({ id }, questionData);
    const updatedQuestion = await this.questionRepository.findOne({
      where: { id },
    });

    if (!updatedQuestion) {
      throw new Error(`Question with ID ${id} not found`);
    }

    if (terms) {
      const termEntities = await this.termRepository.findBy({ id: In(terms) });
      updatedQuestion.terms = termEntities;
    }

    if (philosophers) {
      const philosopherEntities = await this.philosopherRepository.findBy({
        id: In(philosophers),
      });
      updatedQuestion.philosophers = philosopherEntities;
    }

    return this.questionRepository.save(updatedQuestion);
  }

  async remove(id: number): Promise<void> {
    await this.questionRepository.delete(id);
  }
}
