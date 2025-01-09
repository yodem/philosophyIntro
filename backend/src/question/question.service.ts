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
    const {
      relatedPhilosophers,
      relatedTerms,
      relatedQuestions,
      ...questionData
    } = createQuestionDto;

    const question = this.questionRepository.create(questionData);

    if (relatedPhilosophers) {
      const philosopherEntities = await this.philosopherRepository.findBy({
        id: In(relatedPhilosophers),
      });
      question.relatedPhilosophers = philosopherEntities;
    }

    if (relatedTerms) {
      const termEntities = await this.termRepository.findBy({
        id: In(relatedTerms),
      });
      question.relatedTerms = termEntities;
    }

    if (relatedQuestions) {
      const questionEntities = await this.questionRepository.findBy({
        id: In(relatedQuestions),
      });
      question.relatedQuestions = questionEntities;
    }

    return this.questionRepository.save(question);
  }

  findAll(): Promise<Question[]> {
    return this.questionRepository.find({
      relations: ['relatedTerms', 'relatedPhilosophers', 'relatedQuestions'],
    });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['relatedTerms', 'relatedPhilosophers', 'relatedQuestions'],
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
    const {
      relatedTerms,
      relatedPhilosophers,
      relatedQuestions,
      ...questionData
    } = updateQuestionDto;

    await this.questionRepository.update({ id }, questionData);
    const question = await this.findOne(id);

    if (!question) {
      throw new Error(`Question with ID ${id} not found`);
    }

    if (relatedTerms) {
      question.relatedTerms = await this.termRepository.findBy({
        id: In(relatedTerms),
      });
    }

    if (relatedPhilosophers) {
      question.relatedPhilosophers = await this.philosopherRepository.findBy({
        id: In(relatedPhilosophers),
      });
    }

    if (relatedQuestions) {
      question.relatedQuestions = await this.questionRepository.findBy({
        id: In(relatedQuestions),
      });
    }

    return this.questionRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    await this.questionRepository.delete(id);
  }
}
