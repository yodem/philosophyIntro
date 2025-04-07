import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Content, ContentType } from './entities/content.entity';
import { ContentRelationship } from './entities/contentRelationship.entity';
import { ContentMetadata } from './entities/content-metadata.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { LinkContentsDto } from './dto/link-contents.dto';
import { PaginatedResponse } from '../types/pagination.types';
import { UpdateContentDto } from './dto/update-content.dto';
import { mapContentToRelations } from '../utils';
import { MetadataService } from '../metadata/metadata.service';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,
    @InjectRepository(ContentRelationship)
    private readonly relRepo: Repository<ContentRelationship>,
    @InjectRepository(ContentMetadata)
    private readonly metadataRepo: Repository<ContentMetadata>,
    private readonly metadataService: MetadataService,
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

      // First save the content without metadata
      const { metadata, ...contentData } = dto;
      const createdContent = await this.contentRepo.save(
        this.contentRepo.create(contentData),
      );

      // Then add metadata entries if any
      if (metadata && Object.keys(metadata).length > 0) {
        await this.updateMetadataEntries(createdContent.id, metadata);
      }

      // Return the full content with metadata
      return this.findOne(createdContent.id);
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
      const queryBuilder = this.contentRepo
        .createQueryBuilder('content')
        .leftJoinAndSelect('content.metadataEntries', 'metadata')
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('content.title', 'ASC');

      if (search) {
        queryBuilder.andWhere('content.title ILIKE :search', {
          search: `%${search}%`,
        });
      }

      if (type) {
        queryBuilder.andWhere('content.type = :type', { type });
      }

      const [items, total] = await queryBuilder.getManyAndCount();

      // Convert metadata entries to JSON structure
      const itemsWithMetadata = items.map((item) => {
        if (item.metadataEntries?.length) {
          return {
            ...item,
            metadata: this.metadataService.convertMetadataEntriesToJson(
              item.metadataEntries.map((entry) => ({
                key: entry.key,
                value: entry.value,
              })),
            ),
          };
        }
        return item;
      });

      return { items: itemsWithMetadata, total, page, limit };
    } catch (error) {
      this.logger.error('Failed to fetch content list', error.stack);
      throw new InternalServerErrorException('Failed to fetch content list');
    }
  }

  async findOne(
    id: string,
  ): Promise<Content & { contentTypeDisplayName?: string }> {
    this.logger.log(`Finding content with id: ${id}`);
    try {
      const content = await this.contentRepo.findOne({
        where: { id },
        relations: ['metadataEntries'],
      });

      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      // Get relationships only from content1 direction for cleaner grouping
      const relations = await this.relRepo.find({
        where: { content1: { id } },
        relations: ['content2'],
      });

      // Convert metadata entries to a JSON object
      const metadata = this.metadataService.convertMetadataEntriesToJson(
        content.metadataEntries?.map((entry) => ({
          key: entry.key,
          value: entry.value,
        })) || [],
      );

      // Enhance content with metadata and relations
      const contentWithMetadata = { ...content, metadata };
      const contentWithRelations = mapContentToRelations(
        contentWithMetadata,
        relations.map((r) => r.content2),
      );

      // Add content type display name
      return {
        ...contentWithRelations,
        contentTypeDisplayName: this.metadataService.getContentTypeDisplayName(
          content.type,
        ),
      };
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
      const content = await this.contentRepo.findOne({
        where: { id },
        relations: ['metadataEntries'],
      });

      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      // Handle metadata separately
      const { metadata, ...contentData } = dto;

      // Update metadata entries if provided
      if (metadata) {
        await this.updateMetadataEntries(id, metadata);
      }

      // Collect all related content IDs from various relationship types
      const relatedIds: string[] = [];

      // Extract IDs from philosopher array if present
      if (dto.philosopher && dto.philosopher.length > 0) {
        relatedIds.push(...dto.philosopher.map((p) => p.id));
        // Remove from dto as it's handled separately
        delete dto.philosopher;
      }

      // Extract IDs from term array if present
      if (dto.term && dto.term.length > 0) {
        relatedIds.push(...dto.term.map((t) => t.id));
        // Remove from dto as it's handled separately
        delete dto.term;
      }

      // Extract IDs from question array if present
      if (dto.question && dto.question.length > 0) {
        relatedIds.push(...dto.question.map((q) => q.id));
        // Remove from dto as it's handled separately
        delete dto.question;
      }

      // Only update relationships if there are related IDs
      if (relatedIds.length > 0) {
        // Remove existing relationships first
        await this.relRepo.delete({ content1: { id } });
        await this.relRepo.delete({ content2: { id } });

        // Get unique IDs to avoid duplicate relationships
        const uniqueIds = [...new Set(relatedIds)];

        // Create new bidirectional relationships
        const relatedContents = await this.contentRepo.findBy({
          id: In(uniqueIds),
        });

        if (relatedContents.length > 0) {
          // Explicitly type the relationships array
          const relationships: ContentRelationship[] = [];

          relatedContents.forEach((relatedContent) => {
            // Add relation: content -> relatedContent
            relationships.push(
              this.relRepo.create({
                content1: content,
                content2: relatedContent,
              }),
            );

            // Add reciprocal relation: relatedContent -> content
            relationships.push(
              this.relRepo.create({
                content1: relatedContent,
                content2: content,
              }),
            );
          });

          await this.relRepo.save(relationships);
        }
      }

      // Update the content with the remaining properties
      Object.assign(content, contentData);
      await this.contentRepo.save(content);

      // Return the updated content with all its data
      return this.findOne(id);
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
      const content = await this.contentRepo.findOneBy({ id });
      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      // Remove all relationships
      await this.relRepo.delete({ content1: { id } });
      await this.relRepo.delete({ content2: { id } });

      // Remove content (cascading will remove metadata entries)
      await this.contentRepo.remove(content);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to remove content with ID ${id}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to remove content with ID ${id}`,
      );
    }
  }

  // Helper method to update metadata entries
  private async updateMetadataEntries(
    contentId: string,
    metadata: Record<string, any>,
  ): Promise<void> {
    // Find existing content
    const content = await this.contentRepo.findOne({
      where: { id: contentId },
      relations: ['metadataEntries'],
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    // Remove all existing metadata entries
    if (content.metadataEntries?.length) {
      await this.metadataRepo.remove(content.metadataEntries);
    }

    // Create new metadata entries
    const metadataEntries = Object.entries(metadata).map(([key, value]) =>
      this.metadataRepo.create({
        key,
        value: String(value), // Convert all values to string
        content: { id: contentId },
      }),
    );

    if (metadataEntries.length) {
      await this.metadataRepo.save(metadataEntries);
    }
  }

  async linkContents(dto: LinkContentsDto): Promise<ContentRelationship> {
    const content1 = await this.contentRepo.findOneBy({ id: dto.contentId1 });
    const content2 = await this.contentRepo.findOneBy({ id: dto.contentId2 });

    if (!content1 || !content2)
      throw new NotFoundException('Invalid content IDs');

    // Create bidirectional relationships
    const relationship1 = this.relRepo.create({ content1, content2 });
    const relationship2 = this.relRepo.create({
      content1: content2,
      content2: content1,
    });

    await this.relRepo.save([relationship1, relationship2]);
    return relationship1;
  }

  async findRelated(id: string, type?: ContentType): Promise<Content[]> {
    const content = await this.contentRepo.findOneBy({ id });
    if (!content) throw new NotFoundException(`Content ${id} not found`);

    // More efficient query to get related content
    const queryBuilder = this.contentRepo
      .createQueryBuilder('content')
      .select(['content.id', 'content.title', 'content.type'])
      .innerJoin('content_relationship', 'rel', 'rel.content2Id = content.id')
      .where('rel.content1Id = :id', { id });

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    return queryBuilder.getMany();
  }
}
