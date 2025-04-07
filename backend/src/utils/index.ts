import { Content } from '@/content/entities/content.entity';

// Map a content entity to its related content items
export function mapContentToRelations(
  content: Content & { metadata?: Record<string, any> },
  relatedContent: Content[],
): Content & {
  metadata?: Record<string, any>;
  [key: string]: any; // Explicit index signature
} {
  const result = { ...content };

  // Group related content by type
  const groupedByType = relatedContent.reduce(
    (acc, item) => {
      const type = item.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    },
    {} as Record<string, Content[]>,
  );

  // Add grouped relations to result
  Object.entries(groupedByType).forEach(([type, items]) => {
    result[type as keyof typeof result] = items as any; // Explicit cast to avoid type mismatch
  });

  return result;
}
