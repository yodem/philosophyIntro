import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike, In } from 'typeorm';
import { Content, ContentType } from './entities/content.entity';
import { ContentRelationship } from './entities/contentRelationship.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { LinkContentsDto } from './dto/link-contents.dto';
import { PaginatedResponse } from '../types/pagination.types';
import { UpdateContentDto } from '@/content/dto/update-content.dto';
import { mapContentToRelations } from '@/utils';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,
    @InjectRepository(ContentRelationship)
    private readonly relRepo: Repository<ContentRelationship>,
  ) {}

  async create(dto: CreateContentDto): Promise<Content> {
    this.logger.log('Creating new content');
    try {
      // If there's legacy metadata with description, move it to the description field
      if (
        dto.metadata &&
        (dto.metadata as any).description &&
        !dto.description
      ) {
        dto.description = (dto.metadata as any).description;
        delete (dto.metadata as any).description;
      }

      return await this.contentRepo.save(this.contentRepo.create(dto));
    } catch (error) {
      this.logger.error('Failed to create content', error.stack);
      throw new InternalServerErrorException('Failed to create content');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    type?: ContentType,
  ): Promise<PaginatedResponse<Content>> {
    this.logger.log(
      `Finding all content - Page: ${page}, Limit: ${limit}, Search: ${search}, Type: ${type}`,
    );
    try {
      const options: FindManyOptions<Content> = {
        skip: (page - 1) * limit,
        take: limit,
        order: { title: 'ASC' },
      };

      if (search) {
        options.where = { title: ILike(`%${search}%`) };
      }

      if (type) {
        options.where = { ...options.where, type };
      }

      const [items, total] = await this.contentRepo.findAndCount(options);
      return { items, total, page, limit };
    } catch (error) {
      this.logger.error('Failed to fetch content list', error.stack);
      throw new InternalServerErrorException('Failed to fetch content list');
    }
  }

  async findOne(id: string): Promise<Content> {
    this.logger.log(`Finding content with id: ${id}`);
    try {
      const content = await this.contentRepo.findOneBy({ id });
      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }
      const relations = await this.relRepo.find({
        where: { content1: { id } },
        relations: ['content2'],
      });
      return mapContentToRelations(
        content,
        relations.map((r) => r.content2) as Content[],
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch content with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to fetch content with ID ${id}`,
      );
    }
  }

  async update(id: string, dto: UpdateContentDto): Promise<Content> {
    this.logger.log(`Updating content with id: ${id}`);
    try {
      const content = await this.findOne(id);

      // If there's legacy metadata with description, move it to the description field
      if (
        dto.metadata &&
        (dto.metadata as any).description &&
        !dto.description
      ) {
        dto.description = (dto.metadata as any).description;
        delete (dto.metadata as any).description;
      }

      // Handle related content IDs if provided
      if (dto.relatedContentIds && dto.relatedContentIds.length > 0) {
        // Remove existing relationships first
        await this.relRepo.delete({ content1: { id } });

        // Create new relationships
        const relatedContents = await this.contentRepo.findBy({
          id: In(dto.relatedContentIds),
        });

        if (relatedContents.length > 0) {
          const relationships = relatedContents.map((relatedContent) =>
            this.relRepo.create({
              content1: content,
              content2: relatedContent,
            }),
          );
          await this.relRepo.save(relationships);
        }

        // Remove relatedContentIds from dto as it's not a property of Content entity
        delete dto.relatedContentIds;
      }

      // Update the content with the remaining properties
      Object.assign(content, dto);
      return await this.contentRepo.save(content);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update content with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to update content with ID ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing content with id: ${id}`);
    try {
      const content = await this.findOne(id);
      await this.relRepo.delete({ content1: { id } });
      await this.relRepo.delete({ content2: { id } });
      await this.contentRepo.remove(content);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to remove content with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to remove content with ID ${id}`,
      );
    }
  }

  async linkContents(dto: LinkContentsDto): Promise<ContentRelationship> {
    const content1 = await this.contentRepo.findOneBy({ id: dto.contentId1 });
    const content2 = await this.contentRepo.findOneBy({ id: dto.contentId2 });
    if (!content1 || !content2)
      throw new NotFoundException('Invalid content IDs');
    const relationship = this.relRepo.create({ content1, content2 });
    return this.relRepo.save(relationship);
  }

  async findRelated(id: string, type?: ContentType): Promise<Content[]> {
    const content = await this.contentRepo.findOneBy({ id });
    if (!content) throw new NotFoundException(`Content ${id} not found`);
    const relations = await this.relRepo.find({
      where: [{ content1: { id } }, { content2: { id } }],
      relations: ['content1', 'content2'],
    });
    const relatedIds = relations.map((r) =>
      r.content1.id === id ? r.content2.id : r.content1.id,
    );
    if (!relatedIds.length) return [];
    if (type) {
      return this.contentRepo.find({
        where: {
          id: In(relatedIds),
          type,
        },
      });
    }
    return this.contentRepo.findByIds(relatedIds);
  }
}
