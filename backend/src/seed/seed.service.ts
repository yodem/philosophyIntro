import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';
import { Term } from '@/term/entities/term.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Philosopher)
    private readonly philosopherRepository: Repository<Philosopher>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>,
  ) {}

  async seed() {
    try {
      this.logger.log('Starting database seeding...');

      this.logger.log('Seeding philosophers...');
      const philosophers = await this.seedPhilosophers();
      this.logger.log(`Created ${philosophers.length} philosophers`);

      this.logger.log('Seeding terms...');
      const terms = await this.seedTerms();
      this.logger.log(`Created ${terms.length} terms`);

      this.logger.log('Seeding questions...');
      const questions = await this.seedQuestions();
      this.logger.log(`Created ${questions.length} questions`);

      this.logger.log('Creating relationships...');
      await this.createRelationships(philosophers, terms, questions);
      this.logger.log('Successfully created all relationships');

      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Failed to seed database', error.stack);
      throw error;
    }
  }

  private async seedPhilosophers() {
    try {
      const philosophers = [
        {
          title: 'Socrates',
          content:
            'Classical Greek philosopher who laid the foundations of Western philosophical inquiry. Known for the Socratic method and his influence on Plato.',
          era: 'Ancient',
          birthdate: '470 BCE',
          deathdate: '399 BCE',
        },
        {
          title: 'Plato',
          content:
            'Student of Socrates and teacher of Aristotle. Founded the Academy in Athens. Known for his theory of Forms and political philosophy.',
          era: 'Ancient',
          birthdate: '428 BCE',
          deathdate: '348 BCE',
        },
        {
          title: 'Aristotle',
          content:
            "Studied at Plato's Academy. Founder of formal logic and influential in metaphysics, ethics, and natural sciences.",
          era: 'Ancient',
          birthdate: '384 BCE',
          deathdate: '322 BCE',
        },
      ];

      const saved = await this.philosopherRepository.save(philosophers);
      philosophers.forEach((p) => {
        this.logger.verbose(`Created philosopher: ${p.title}`);
      });
      return saved;
    } catch (error) {
      this.logger.error('Failed to seed philosophers', error.stack);
      throw error;
    }
  }

  private async seedTerms() {
    try {
      const terms = [
        {
          title: 'Epistemology',
          content:
            'Branch of philosophy concerned with the theory of knowledge. Explores questions about the nature, sources, and limits of human knowledge.',
        },
        {
          title: 'Metaphysics',
          content:
            'Branch of philosophy dealing with the fundamental nature of reality and existence. Includes concepts of being, knowing, substance, cause, identity, time, and space.',
        },
        {
          title: 'Ethics',
          content:
            'Branch of philosophy concerned with questions about morality, including concepts of right and wrong, virtue, justice, and the good life.',
        },
      ];

      const saved = await this.termRepository.save(terms);
      terms.forEach((t) => {
        this.logger.verbose(`Created term: ${t.title}`);
      });
      return saved;
    } catch (error) {
      this.logger.error('Failed to seed terms', error.stack);
      throw error;
    }
  }

  private async seedQuestions() {
    try {
      const questions = [
        {
          title: 'What is knowledge?',
          content:
            "Fundamental epistemological question exploring the nature and possibility of knowledge. Central to Plato's dialogues and modern epistemology.",
        },
        {
          title: 'What is the nature of reality?',
          content:
            'Core metaphysical question examining the fundamental nature of existence and being. Addressed by philosophers from Parmenides to contemporary thinkers.',
        },
        {
          title: 'What is the good life?',
          content:
            'Essential ethical question investigating human flourishing and the nature of happiness. Central to ancient Greek ethics and modern moral philosophy.',
        },
      ];

      const saved = await this.questionRepository.save(questions);
      questions.forEach((q) => {
        this.logger.verbose(`Created question: ${q.title}`);
      });
      return saved;
    } catch (error) {
      this.logger.error('Failed to seed questions', error.stack);
      throw error;
    }
  }

  private async createRelationships(
    philosophers: Philosopher[],
    terms: Term[],
    questions: Question[],
  ) {
    try {
      this.logger.log('Setting up philosopher relationships...');
      // Philosopher relationships
      philosophers[0].relatedTerms = [terms[0]]; // Socrates -> Epistemology
      philosophers[0].relatedQuestions = [questions[0]]; // Socrates -> What is knowledge?
      philosophers[0].relatedPhilosophers = [philosophers[1]]; // Socrates -> Plato

      philosophers[1].relatedTerms = [terms[1]]; // Plato -> Metaphysics
      philosophers[1].relatedQuestions = [questions[1]]; // Plato -> What is the nature of reality?
      philosophers[1].relatedPhilosophers = [philosophers[0], philosophers[2]]; // Plato -> Socrates, Aristotle

      philosophers[2].relatedTerms = [terms[2]]; // Aristotle -> Ethics
      philosophers[2].relatedQuestions = [questions[2]]; // Aristotle -> What is the good life?
      philosophers[2].relatedPhilosophers = [philosophers[1]]; // Aristotle -> Plato

      await this.philosopherRepository.save(philosophers);
      this.logger.log('Philosopher relationships created successfully');

      this.logger.log('Setting up term relationships...');
      // Term relationships
      terms[0].relatedQuestions = [questions[0]]; // Epistemology -> What is knowledge?
      terms[0].relatedTerms = [terms[1]]; // Epistemology -> Metaphysics

      terms[1].relatedQuestions = [questions[1]]; // Metaphysics -> What is the nature of reality?
      terms[1].relatedTerms = [terms[0], terms[2]]; // Metaphysics -> Epistemology, Ethics

      terms[2].relatedQuestions = [questions[2]]; // Ethics -> What is the good life?
      terms[2].relatedTerms = [terms[1]]; // Ethics -> Metaphysics

      await this.termRepository.save(terms);
      this.logger.log('Term relationships created successfully');

      this.logger.log('Setting up question relationships...');
      // Question relationships
      questions[0].relatedQuestions = [questions[1]]; // Knowledge -> Reality
      questions[1].relatedQuestions = [questions[0], questions[2]]; // Reality -> Knowledge, Good life
      questions[2].relatedQuestions = [questions[1]]; // Good life -> Reality

      await this.questionRepository.save(questions);
      this.logger.log('Question relationships created successfully');
    } catch (error) {
      this.logger.error('Failed to create relationships', error.stack);
      throw error;
    }
  }
}
