import { Content } from '@/content/entities/content.entity';
import { PopulatedContent } from '@/types';

export const mapContentToRelations = (
  content: Content,
  relations: Content[],
): PopulatedContent => {
  const mappedRelations = relations.reduce<Record<string, Content[]>>(
    (acc, relation) => {
      if (!relation.type) return acc; // Skip if relation.type is undefined or null
      return {
        ...acc,
        [relation.type]: [...(acc[relation.type] || []), relation],
      };
    },
    {},
  );
  return { ...content, ...mappedRelations };
};
