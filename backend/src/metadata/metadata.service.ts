import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentType } from '../content/entities/content.entity';

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
export class MetadataService {
  // Map content types to their display names
  private contentTypeDisplayNames: Record<ContentType, string> = {
    [ContentType.PHILOSOPHER]: 'Philosopher',
    [ContentType.QUESTION]: 'Question',
    [ContentType.TERM]: 'Term',
  };

  // Define metadata schemas for each content type
  private metadataSchemas: Record<ContentType, MetadataDefinition[]> = {
    [ContentType.PHILOSOPHER]: [
      {
        key: 'birthDate',
        displayName: 'Birth Date',
        dataType: 'date',
        isRequired: false,
      },
      {
        key: 'deathDate',
        displayName: 'Death Date',
        dataType: 'date',
        isRequired: false,
      },
      {
        key: 'era',
        displayName: 'Era',
        dataType: 'string',
        isRequired: false,
      },
      {
        key: 'nationality',
        displayName: 'Nationality',
        dataType: 'string',
        isRequired: false,
      },
    ],
    [ContentType.QUESTION]: [
      {
        key: 'category',
        displayName: 'Category',
        dataType: 'string',
        isRequired: false,
      },
      {
        key: 'difficulty',
        displayName: 'Difficulty Level',
        dataType: 'number',
        isRequired: false,
      },
    ],
    [ContentType.TERM]: [
      {
        key: 'origin',
        displayName: 'Origin',
        dataType: 'string',
        isRequired: false,
      },
      {
        key: 'firstUse',
        displayName: 'First Use',
        dataType: 'date',
        isRequired: false,
      },
    ],
  };

  // Get all content types with their display names
  getAllContentTypes(): ContentTypeInfo[] {
    return Object.values(ContentType).map((type) => ({
      id: type,
      displayName: this.contentTypeDisplayNames[type] || type,
    }));
  }

  // Get metadata schema for a specific content type
  getMetadataSchema(contentType: ContentType): MetadataDefinition[] {
    const schema = this.metadataSchemas[contentType];
    if (!schema) {
      throw new NotFoundException(
        `Schema not found for content type: ${contentType}`,
      );
    }
    return schema;
  }

  // Get display name for a content type
  getContentTypeDisplayName(contentType: ContentType): string {
    return this.contentTypeDisplayNames[contentType] || contentType;
  }

  // Validate metadata against schema
  validateMetadata(
    contentType: ContentType,
    metadata: Record<string, any>,
  ): { isValid: boolean; errors: string[] } {
    const schema = this.metadataSchemas[contentType];
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
  getMetadataKeys(contentType?: ContentType): string[] {
    if (!contentType) {
      return Object.values(ContentType)
        .flatMap((type) => this.metadataSchemas[type])
        .map((def) => def.key)
        .filter((key, index, self) => self.indexOf(key) === index); // Remove duplicates
    }

    const schema = this.metadataSchemas[contentType];
    if (!schema) {
      return [];
    }

    return schema.map((def) => def.key);
  }
}
