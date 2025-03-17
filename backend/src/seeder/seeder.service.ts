import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content, ContentType } from '../content/entities/content.entity';
import { ContentRelationship } from '../content/entities/contentRelationship.entity';
import * as philosophers from './philosophers.json';
import * as terms from './categories.json';

interface IImages {
  faceImages?: {
    face250x250?: string;
    face500x500?: string;
  };
  fullImages?: {
    full600x800?: string;
  };
  banner400x300?: string;
  banner800x600?: string;
}

interface ITermData {
  id: string;
  images?: IImages;
  associatedPhilosophers: string[];
  associatedCategories: string[];
  name: string;
  description: string;
  content: string;
  full_picture?: string;
  description_picture?: string;
}

interface IPhilosopherData {
  id: string;
  images?: IImages;
  birthDate: string;
  deathDate: string;
  title: string;
  content: string;
  topicalDescription: string;
  era: string;
  associatedCategories: (string | { id: string })[];
  associatedPhilosophers: string[];
  full_picture?: string;
  description_picture?: string;
}

const IMAGE_PREFIX = 'https://philosophersapi.com';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(ContentRelationship)
    private relationshipRepository: Repository<ContentRelationship>,
  ) {}

  async seed() {
    this.logger.log('Starting seeding process...');

    // 1. Create or update philosophers as content entries
    const philosophersToSave: Content[] = [];
    for (const philData of philosophers as IPhilosopherData[]) {
      let philosopher = await this.contentRepository.findOneBy({
        id: philData.id,
        type: ContentType.PHILOSOPHER,
      });

      const metadata = {
        birthDate: philData.birthDate,
        deathDate: philData.deathDate,
        era: philData.era,
      };

      // Extract images from provided fields if any
      if (philData.full_picture && philosopher) {
        philosopher.full_picture = `${IMAGE_PREFIX}${philData.full_picture}`;
      }
      if (philData.description_picture && philosopher) {
        philosopher.description_picture = `${IMAGE_PREFIX}${philData.description_picture}`;
      }

      if (philosopher) {
        philosopher.metadata = metadata;
        philosopher.title = philData.title;
        philosopher.content = philData.content;
        philosopher.description = philData.topicalDescription;
      } else {
        philosopher = this.contentRepository.create({
          id: philData.id,
          type: ContentType.PHILOSOPHER,
          title: philData.title,
          content: philData.content,
          description: philData.topicalDescription,
          metadata: metadata,
          full_picture: philData.full_picture
            ? `${IMAGE_PREFIX}${philData.full_picture}`
            : undefined,
          description_picture: philData.description_picture
            ? `${IMAGE_PREFIX}${philData.description_picture}`
            : undefined,
        });
      }
      philosophersToSave.push(philosopher);
    }
    await this.contentRepository.save(philosophersToSave);
    this.logger.log(`Saved ${philosophersToSave.length} philosophers.`);

    // 2. Create or update terms as content entries
    const termsToSave: Content[] = [];
    for (const termData of terms as ITermData[]) {
      let term = await this.contentRepository.findOneBy({
        id: termData.id,
        type: ContentType.TERM,
      });

      // Metadata now without description
      const metadata = {};

      // Extract images from provided fields
      if (termData.full_picture && term) {
        term.full_picture = `${IMAGE_PREFIX}${termData.full_picture}`;
      }
      if (termData.description_picture && term) {
        term.description_picture = `${IMAGE_PREFIX}${termData.description_picture}`;
      }

      if (term) {
        term.metadata = metadata;
        term.title = termData.name;
        term.content = termData.content;
        term.description = termData.description;
      } else {
        term = this.contentRepository.create({
          id: termData.id,
          type: ContentType.TERM,
          title: termData.name,
          content: termData.content,
          description: termData.description,
          metadata: metadata,
          full_picture: termData.full_picture
            ? `${IMAGE_PREFIX}${termData.full_picture}`
            : undefined,
          description_picture: termData.description_picture
            ? `${IMAGE_PREFIX}${termData.description_picture}`
            : undefined,
        });
      }
      termsToSave.push(term);
    }
    await this.contentRepository.save(termsToSave);
    this.logger.log(`Saved ${termsToSave.length} terms.`);

    // 3. Create relationships between philosophers and terms
    this.logger.log('Creating content relationships...');
    for (const philData of philosophers as IPhilosopherData[]) {
      if (philData.associatedCategories?.length) {
        for (const categoryId of philData.associatedCategories) {
          // Handle either string IDs or objects with ID property
          const catId =
            typeof categoryId === 'string' ? categoryId : categoryId.id;

          // Check if relationship already exists
          const existingRelationship =
            await this.relationshipRepository.findOne({
              where: [
                { content1: { id: philData.id }, content2: { id: catId } },
                { content1: { id: catId }, content2: { id: philData.id } },
              ],
              relations: ['content1', 'content2'],
            });

          if (!existingRelationship) {
            // Create new relationship
            await this.relationshipRepository.save({
              content1: { id: philData.id },
              content2: { id: catId },
            });
          }
        }
      }
    }

    this.logger.log('All relationships created.');
    this.logger.log('Seeding process completed.');

    return {
      philosophersCount: philosophersToSave.length,
      termsCount: termsToSave.length,
    };
  }
}
