import { Content } from '@/content/entities/content.entity';

export type PopulatedContent = Content & {
  philosophers?: Content[];
  questions?: Content[];
  terms?: Content[];
};
