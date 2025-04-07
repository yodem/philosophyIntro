import { Content } from '@/content/entities/content.entity';
import { PopulatedContent } from '@/types';

export const mapContentToRelations = (
  content: Content,
  relations: Content[],
): PopulatedContent => {
  // Group relations by type for more efficient access
  const mappedRelations = relations.reduce<Record<string, Content[]>>(
    (acc, relation) => {
      if (!relation.type) return acc; // Skip if relation.type is undefined or null

      // Only include id and title for related entities
      const simplifiedRelation = {
        id: relation.id,
        title: relation.title,
        type: relation.type,
      };

      return {
        ...acc,
        [relation.type]: [
          ...(acc[relation.type] || []),
          simplifiedRelation as Content,
        ],
      };
    },
    {},
  );
  return { ...content, ...mappedRelations };
};
