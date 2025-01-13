import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';
import { Term } from '@/term/entities/term.entity';
import { translatedSchools, translatedPhilosophers } from '@/consts';
// Update these imports to use relative paths

interface TranslatedContent {
  title: string;
  content: string | null;
}

interface TranslatedPhilosopher {
  id: string;
  english: TranslatedContent;
  hebrew: TranslatedContent;
  relevant_terms?: string[];
}

interface TranslatedSchool {
  id: string;
  english: TranslatedContent;
  hebrew: {
    title: string | null;
    content: string | null;
  };
}

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

      if (!translatedSchools?.length || !translatedPhilosophers?.length) {
        throw new Error('No data found in JSON files');
      }

      this.logger.log('Seeding terms...');
      const terms = await this.seedTerms();
      this.logger.log(`Created ${terms.length} terms`);

      this.logger.log('Seeding philosophers...');
      const philosophers = await this.seedPhilosophers();
      this.logger.log(`Created ${philosophers.length} philosophers`);

      this.logger.log('Creating relationships...');
      await this.createRelationships(philosophers, terms);

      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Failed to seed database', error.stack);
      throw error;
    }
  }

  private async seedTerms() {
    try {
      if (!Array.isArray(translatedSchools)) {
        throw new Error('Invalid schools data format');
      }

      const terms: Term[] = translatedSchools
        .filter((school) => !!school && !!school.id)
        .map((school) => ({
          id: parseInt(school.id),
          titleEn: school.english?.title || '',
          contentEn: school.english?.content || '',
          titleHe: school.hebrew?.title || '',
          contentHe: school.hebrew?.content || '',
          relatedPhilosophers: [],
          relatedQuestions: [],
          relatedTerms: [],
        }));

      if (!terms.length) {
        throw new Error('No valid terms to save');
      }

      return await this.termRepository.save(terms);
    } catch (error) {
      this.logger.error('Failed to seed terms', error.stack);
      throw error;
    }
  }

  private async seedPhilosophers() {
    try {
      if (!Array.isArray(translatedPhilosophers)) {
        throw new Error('Invalid philosophers data format');
      }

      const philosophers: Philosopher[] = translatedPhilosophers
        .filter((philosopher) => !!philosopher && !!philosopher.id)
        .map((philosopher) => ({
          id: parseInt(philosopher.id),
          titleEn: philosopher.english?.title || '',
          contentEn: philosopher.english?.content || '',
          titleHe: philosopher.hebrew?.title || '',
          contentHe: philosopher.hebrew?.content || '',
          era: '',
          birthdate: '',
          deathdate: '',
          relatedPhilosophers: [],
          relatedQuestions: [],
          relatedTerms: [],
        }));

      if (!philosophers.length) {
        throw new Error('No valid philosophers to save');
      }

      return await this.philosopherRepository.save(philosophers);
    } catch (error) {
      this.logger.error('Failed to seed philosophers', error.stack);
      throw error;
    }
  }

  private async createRelationships(
    philosophers: Philosopher[],
    terms: Term[],
  ) {
    try {
      const relationshipsToSave = philosophers.map(async (philosopher) => {
        const philosopherData = translatedPhilosophers.find(
          (p) => p && parseInt(p.id) === philosopher.id,
        );

        if (philosopherData?.relevant_terms?.length) {
          philosopher.relatedTerms = terms.filter(
            (term) =>
              term &&
              philosopherData.relevant_terms.includes(term.id.toString()),
          );
        }

        return philosopher;
      });

      const updatedPhilosophers = await Promise.all(relationshipsToSave);
      const validPhilosophers = updatedPhilosophers.filter(
        (p) => p !== undefined,
      );

      if (validPhilosophers.length) {
        await this.philosopherRepository.save(validPhilosophers);
        this.logger.log('Successfully created all relationships');
      }
    } catch (error) {
      this.logger.error('Failed to create relationships', error.stack);
      throw error;
    }
  }
}
