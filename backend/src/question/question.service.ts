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
      associatedTerms,
      associatedQuestions,
      associatedPhilosophers,
      ...questionData
    } = createQuestionDto;
    const question = this.questionRepository.create(questionData);

    if (associatedTerms) {
      question.associatedTerms = await this.termRepository.findBy({
        id: In(associatedTerms),
      });
    }

    if (associatedQuestions) {
      question.associatedQuestions = await this.questionRepository.findBy({
        id: In(associatedQuestions),
      });
    }

    if (associatedPhilosophers) {
      question.associatedPhilosophers = await this.philosopherRepository.findBy(
        {
          id: In(associatedPhilosophers),
        },
      );
    }

    return this.questionRepository.save(question);
  }

  findAll(): Promise<Question[]> {
    return this.questionRepository.find({
      relations: [
        'associatedTerms',
        'associatedQuestions',
        'associatedPhilosophers',
      ],
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: [
        'associatedTerms',
        'associatedQuestions',
        'associatedPhilosophers',
      ],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const {
      associatedTerms,
      associatedQuestions,
      associatedPhilosophers,
      ...questionData
    } = updateQuestionDto;

    await this.questionRepository.update({ id }, questionData);
    const question = await this.findOne(id);

    if (associatedTerms) {
      question.associatedTerms = await this.termRepository.findBy({
        id: In(associatedTerms),
      });
    }

    if (associatedQuestions) {
      question.associatedQuestions = await this.questionRepository.findBy({
        id: In(associatedQuestions),
      });
    }

    if (associatedPhilosophers) {
      question.associatedPhilosophers = await this.philosopherRepository.findBy(
        {
          id: In(associatedPhilosophers),
        },
      );
    }

    return this.questionRepository.save(question);
  }

  async remove(id: string): Promise<void> {
    await this.questionRepository.delete(id);
  }
}
