import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentType } from '../content/entities/content.entity';
import { MetadataSchema } from './entities/metadata-schema.entity';

export interface MetadataDefinition {
  key: string;
  displayName: string;
  dataType: 'string' | 'number' | 'date' | 'text';
  isRequired: boolean;
}

export interface ContentTypeInfo {
  id: string;
  displayName: string;
}

@Injectable()
export class MetadataService implements OnModuleInit {
  // Map content types to their display names
  private contentTypeDisplayNames: Record<ContentType, string> = {
    [ContentType.PHILOSOPHER]: 'Philosopher',
    [ContentType.QUESTION]: 'Question',
    [ContentType.TERM]: 'Term',
  };

  // Cached schemas
  private cachedSchemas: Record<ContentType, MetadataDefinition[]> = {
    [ContentType.PHILOSOPHER]: [],
    [ContentType.QUESTION]: [],
    [ContentType.TERM]: [],
  };

  constructor(
    @InjectRepository(MetadataSchema)
    private metadataSchemaRepo: Repository<MetadataSchema>,
  ) {}

  // Initialize default schemas if none exist
  async onModuleInit() {
    const count = await this.metadataSchemaRepo.count();
    if (count === 0) {
      await this.initializeDefaultSchemas();
    }

    // Load schemas into cache
    await this.loadSchemasIntoCache();
  }

  // Load all schemas from database into memory cache
  private async loadSchemasIntoCache() {
    const allSchemas = await this.metadataSchemaRepo.find({
      order: { contentType: 'ASC', displayOrder: 'ASC' },
    });

    // Initialize empty arrays for each content type
    for (const type of Object.values(ContentType)) {
      this.cachedSchemas[type] = [];
    }

    // Group schemas by content type
    for (const schema of allSchemas) {
      this.cachedSchemas[schema.contentType].push({
        key: schema.key,
        displayName: schema.displayName,
        dataType: schema.dataType,
        isRequired: schema.isRequired,
      });
    }
  }

  // Initialize default schemas
  private async initializeDefaultSchemas() {
    const defaultSchemas = [
      // Philosopher schemas
      {
        contentType: ContentType.PHILOSOPHER,
        key: 'birthDate',
        displayName: 'Birth Date',
        dataType: 'date' as const,
        isRequired: false,
        displayOrder: 0,
      },
      {
        contentType: ContentType.PHILOSOPHER,
        key: 'deathDate',
        displayName: 'Death Date',
        dataType: 'date' as const,
        isRequired: false,
        displayOrder: 1,
      },
      {
        contentType: ContentType.PHILOSOPHER,
        key: 'era',
        displayName: 'Era',
        dataType: 'string' as const,
        isRequired: false,
        displayOrder: 2,
      },
      {
        contentType: ContentType.PHILOSOPHER,
        key: 'nationality',
        displayName: 'Nationality',
        dataType: 'string' as const,
        isRequired: false,
        displayOrder: 3,
      },

      // Question schemas
      {
        contentType: ContentType.QUESTION,
        key: 'category',
        displayName: 'Category',
        dataType: 'string' as const,
        isRequired: false,
        displayOrder: 0,
      },
      {
        contentType: ContentType.QUESTION,
        key: 'difficulty',
        displayName: 'Difficulty Level',
        dataType: 'number' as const,
        isRequired: false,
        displayOrder: 1,
      },

      // Term schemas
      {
        contentType: ContentType.TERM,
        key: 'origin',
        displayName: 'Origin',
        dataType: 'string' as const,
        isRequired: false,
        displayOrder: 0,
      },
      {
        contentType: ContentType.TERM,
        key: 'firstUse',
        displayName: 'First Use',
        dataType: 'date' as const,
        isRequired: false,
        displayOrder: 1,
      },
    ];

    await this.metadataSchemaRepo.save(
      defaultSchemas.map((schema) => this.metadataSchemaRepo.create(schema)),
    );
  }

  // Get all content types with their display names
  getAllContentTypes(): ContentTypeInfo[] {
    return Object.values(ContentType).map((type) => ({
      id: type,
      displayName: this.contentTypeDisplayNames[type] || type,
    }));
  }

  // Get metadata schema for a specific content type
  async getMetadataSchema(
    contentType: ContentType,
  ): Promise<MetadataDefinition[]> {
    // If schema is already in cache, return it
    if (this.cachedSchemas[contentType]) {
      return this.cachedSchemas[contentType];
    }

    // Otherwise, fetch from database
    const schemas = await this.metadataSchemaRepo.find({
      where: { contentType },
      order: { displayOrder: 'ASC' },
    });

    if (!schemas.length) {
      throw new NotFoundException(
        `Schema not found for content type: ${contentType}`,
      );
    }

    // Convert to definition format and cache
    const definitions = schemas.map((schema) => ({
      key: schema.key,
      displayName: schema.displayName,
      dataType: schema.dataType,
      isRequired: schema.isRequired,
    }));

    this.cachedSchemas[contentType] = definitions;
    return definitions;
  }

  // Get display name for a content type
  getContentTypeDisplayName(contentType: ContentType): string {
    return this.contentTypeDisplayNames[contentType] || contentType;
  }

  // Validate metadata against schema
  async validateMetadata(
    contentType: ContentType,
    metadata: Record<string, any>,
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const schema = await this.getMetadataSchema(contentType);
    const errors: string[] = [];

    // Check for required fields
    schema
      .filter((def) => def.isRequired)
      .forEach((def) => {
        if (metadata[def.key] === undefined || metadata[def.key] === null) {
          errors.push(`${def.displayName} is required`);
        }
      });

    // Validate data types
    Object.keys(metadata || {}).forEach((key) => {
      const def = schema.find((d) => d.key === key);
      if (!def) {
        // Allow extra metadata that's not in the schema
        return;
      }

      const value = metadata[key];
      if (value === undefined || value === null) {
        return;
      }

      switch (def.dataType) {
        case 'number':
          if (typeof value !== 'number' && isNaN(Number(value))) {
            errors.push(`${def.displayName} must be a number`);
          }
          break;
        case 'date':
          if (isNaN(Date.parse(String(value)))) {
            errors.push(`${def.displayName} must be a valid date`);
          }
          break;
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get metadata keys for a content type
  async getMetadataKeys(contentType?: ContentType): Promise<string[]> {
    if (!contentType) {
      // Get all keys from all content types
      const allSchemas = await this.metadataSchemaRepo.find();
      return [...new Set(allSchemas.map((schema) => schema.key))];
    }

    const schema = await this.getMetadataSchema(contentType);
    return schema.map((def) => def.key);
  }

  // Create or update a metadata schema
  async upsertMetadataSchema(
    contentType: ContentType,
    schemaDefinition: Omit<MetadataSchema, 'id' | 'contentType'> & {
      id?: string;
    },
  ): Promise<MetadataSchema> {
    if (schemaDefinition.id) {
      // Update existing schema
      await this.metadataSchemaRepo.update(schemaDefinition.id, {
        ...schemaDefinition,
      });

      const updated = await this.metadataSchemaRepo.findOneBy({
        id: schemaDefinition.id,
      });
      if (!updated) {
        throw new NotFoundException(
          `Schema with ID ${schemaDefinition.id} not found`,
        );
      }

      // Invalidate cache
      delete this.cachedSchemas[contentType];

      return updated;
    } else {
      // Create new schema
      const newSchema = this.metadataSchemaRepo.create({
        ...schemaDefinition,
        contentType,
      });

      const saved = await this.metadataSchemaRepo.save(newSchema);

      // Invalidate cache
      delete this.cachedSchemas[contentType];

      return saved;
    }
  }

  // Delete a metadata schema
  async deleteMetadataSchema(id: string): Promise<void> {
    const schema = await this.metadataSchemaRepo.findOneBy({ id });
    if (!schema) {
      throw new NotFoundException(`Schema with ID ${id} not found`);
    }

    await this.metadataSchemaRepo.remove(schema);

    // Invalidate cache
    delete this.cachedSchemas[schema.contentType];
  }

  // Helper method to convert metadata entries to JSON format
  convertMetadataEntriesToJson(
    entries: { key: string; value: string }[],
  ): Record<string, any> {
    if (!entries || entries.length === 0) return {};

    return entries.reduce(
      (result, entry) => {
        // Try to parse numbers and dates
        let parsedValue: any = entry.value;

        // Parse numbers
        if (!isNaN(Number(entry.value)) && entry.value.trim() !== '') {
          parsedValue = Number(entry.value);
        }
        // Parse dates based on schema definition
        else if (this.isDateValue(entry.key, entry.value)) {
          // Keep as string for date values, frontend will handle formatting
        }

        result[entry.key] = parsedValue;
        return result;
      },
      {} as Record<string, any>,
    );
  }

  // Check if a field is defined as a date type in any schema
  private isDateValue(key: string, value: string): boolean {
    // Check cached schemas first
    for (const type of Object.values(ContentType)) {
      const schema = this.cachedSchemas[type];
      if (schema) {
        const definition = schema.find((def) => def.key === key);
        if (definition?.dataType === 'date') {
          // Simple date format validation
          return /^\d{4}(-\d{2})?(-\d{2})?$/.test(value);
        }
      }
    }

    // If not found in cache, assume it's not a date
    return false;
  }
}
