import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';
import { Term } from '@/term/entities/term.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
  ) {}

  async seed() {
    // Create terms
    const terms = await this.termRepository.save([
      {
        term: 'Categorical Imperative',
        definition:
          'A fundamental principle of ethics by Kant that suggests acting only according to rules that could become universal laws.',
      },
      {
        term: 'Virtue Ethics',
        definition:
          'A major approach in normative ethics that emphasizes moral character rather than actions or their consequences.',
      },
    ]);

    // Create questions
    const questions = await this.questionRepository.save([
      {
        question: 'What is the nature of reality?',
        description:
          'The fundamental question about the nature of existence and consciousness.',
        terms: [terms[1]],
      },
      {
        question: 'What is knowledge?',
        description:
          'The exploration of epistemology and the nature of knowing.',
        terms: [terms[0]],
      },
    ]);

    // Create philosophers
    await this.philosopherRepository.save([
      {
        name: 'Immanuel Kant',
        description:
          'German philosopher who is a central figure in modern philosophy.',
        questions: [questions[0]],
        terms: [terms[0]],
      },
      {
        name: 'Aristotle',
        description:
          'Greek philosopher and scientist who founded many fields of study.',
        questions: [questions[1]],
        terms: [terms[1]],
      },
    ]);

    console.log('Seeding completed successfully');
  }
}
