import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Term } from '@/term/entities/term.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as philosophers from './philosophers.json';
import * as terms from './categories.json';

interface IImages {
  banner400x300?: string;
  banner800x600?: string;
  faceImages?: {
    face250x250: string;
    face500x500: string;
  };
  fullImages?: {
    full600x800: string;
  };
}

interface ITermData {
  id: string;
  images: IImages;
  associatedPhilosophers: string[];
  associatedCategories: string[];
  name: string;
  description: string;
  content: string;
}

interface IPhilosopherData {
  id: string;
  images: IImages;
  birthDate: string;
  deathDate: string;
  title: string;
  content: string;
  topicalDescription: string;
  era: string;
  associatedCategories: (string | { id: string })[];
  associatedPhilosophers: string[];
}

const IMAGE_PREFIX = 'https://philosophersapi.com';

// Helper function to add prefix to image URLs
function addImagePrefix(images: IImages): IImages {
  if (!images) return images;

  const prefixedImages: IImages = {};
  if (images.banner400x300)
    prefixedImages.banner400x300 = `${IMAGE_PREFIX}${images.banner400x300}`;
  if (images.banner800x600)
    prefixedImages.banner800x600 = `${IMAGE_PREFIX}${images.banner800x600}`;
  if (images.faceImages) {
    prefixedImages.faceImages = {
      face250x250: `${IMAGE_PREFIX}${images.faceImages.face250x250}`,
      face500x500: `${IMAGE_PREFIX}${images.faceImages.face500x500}`,
    };
  }
  if (images.fullImages) {
    prefixedImages.fullImages = {
      full600x800: `${IMAGE_PREFIX}${images.fullImages.full600x800}`,
    };
  }
  return prefixedImages;
}

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Philosopher)
    private philosopherRepository: Repository<Philosopher>,
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
  ) {}

  async seed() {
    this.logger.log('Starting seeding process...');

    // 1. Create or update philosophers
    const philosopherToSave: Philosopher[] = [];
    for (const philData of philosophers as IPhilosopherData[]) {
      let philosopher = await this.philosopherRepository.findOne({
        where: { id: philData.id },
      });
      const imagesWithPrefix = addImagePrefix(philData.images);
      if (philosopher) {
        philosopher.images = imagesWithPrefix;
        philosopher.birthDate = philData.birthDate;
        philosopher.deathDate = philData.deathDate;
        philosopher.title = philData.title;
        philosopher.content = philData.content;
        philosopher.description = philData.topicalDescription;
        philosopher.era = philData.era;
      } else {
        philosopher = this.philosopherRepository.create({
          id: philData.id,
          images: imagesWithPrefix,
          birthDate: philData.birthDate,
          deathDate: philData.deathDate,
          title: philData.title,
          content: philData.content,
          description: philData.topicalDescription,
          era: philData.era,
        });
      }
      philosopherToSave.push(philosopher);
    }
    await this.philosopherRepository.save(philosopherToSave);
    this.logger.log(`Saved ${philosopherToSave.length} philosophers.`);

    // 2. Create or update terms
    const termsToSave: Term[] = [];
    for (const termData of terms as ITermData[]) {
      let term = await this.termRepository.findOne({
        where: { id: termData.id },
      });
      const imagesWithPrefix = addImagePrefix(termData.images);
      if (term) {
        term.images = imagesWithPrefix;
        term.title = termData.name;
        term.content = termData.content;
        term.description = termData.description;
      } else {
        term = this.termRepository.create({
          id: termData.id,
          images: imagesWithPrefix,
          title: termData.name,
          content: termData.content,
          description: termData.description,
        });
      }
      termsToSave.push(term);
    }
    await this.termRepository.save(termsToSave);
    this.logger.log(`Saved ${termsToSave.length} terms.`);

    // 3. Update philosopher-to-term associations
    this.logger.log('Updating philosopher-to-term associations...');
    for (const philData of philosophers as IPhilosopherData[]) {
      if (philData.associatedCategories?.length) {
        const philosopher = await this.philosopherRepository.findOne({
          where: { id: philData.id },
          relations: ['associatedTerms'],
        });
        if (philosopher) {
          // Clear existing associated terms first
          philosopher.associatedTerms = [];
          await this.philosopherRepository.save(philosopher);

          // Reassign new associations
          philosopher.associatedTerms = philData.associatedCategories
            .map((catId) => termsToSave.find((t) => t.id === catId))
            .filter((t): t is Term => Boolean(t));
          await this.philosopherRepository.save(philosopher);
        }
      }
    }

    this.logger.log('All associations updated.');
    this.logger.log('Seeding process completed.');

    return {
      philosophersCount: philosopherToSave.length,
      termsCount: termsToSave.length,
    };
  }
}
