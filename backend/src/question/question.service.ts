import { Injectable, NotFoundException } from '@nestjs/common';
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
      relatedTerms,
      relatedQuestions,
      relatedPhilosophers,
      ...questionData
    } = createQuestionDto;
    const question = this.questionRepository.create(questionData);

    if (relatedTerms) {
      question.relatedTerms = await this.termRepository.findBy({
        id: In(relatedTerms),
      });
    }

    if (relatedQuestions) {
      question.relatedQuestions = await this.questionRepository.findBy({
        id: In(relatedQuestions),
      });
    }

    if (relatedPhilosophers) {
      question.relatedPhilosophers = await this.philosopherRepository.findBy({
        id: In(relatedPhilosophers),
      });
    }

    return this.questionRepository.save(question);
  }

  findAll(): Promise<Question[]> {
    return this.questionRepository.find({
      relations: ['relatedTerms', 'relatedQuestions', 'relatedPhilosophers'],
    });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['relatedTerms', 'relatedQuestions', 'relatedPhilosophers'],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const {
      relatedTerms,
      relatedQuestions,
      relatedPhilosophers,
      ...questionData
    } = updateQuestionDto;

    await this.questionRepository.update({ id }, questionData);
    const question = await this.findOne(id);

    if (relatedTerms) {
      question.relatedTerms = await this.termRepository.findBy({
        id: In(relatedTerms),
      });
    }

    if (relatedQuestions) {
      question.relatedQuestions = await this.questionRepository.findBy({
        id: In(relatedQuestions),
      });
    }

    if (relatedPhilosophers) {
      question.relatedPhilosophers = await this.philosopherRepository.findBy({
        id: In(relatedPhilosophers),
      });
    }

    return this.questionRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    await this.questionRepository.delete(id);
  }
}
