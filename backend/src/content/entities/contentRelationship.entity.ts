import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Content } from './content.entity';

@Entity()
export class ContentRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Content, (c) => c.outgoingRelationships)
  content1: Content;

  @ManyToOne(() => Content, (c) => c.incomingRelationships)
  content2: Content;
}
