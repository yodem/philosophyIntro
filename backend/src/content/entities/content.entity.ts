import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ContentRelationship } from './contentRelationship.entity';
import { ContentMetadata } from './content-metadata.entity';

export enum ContentType {
  PHILOSOPHER = 'philosopher',
  QUESTION = 'question',
  TERM = 'term',
}
@Entity()
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: false }) // Making the description non-nullable
  description: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  type: ContentType;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  full_picture?: string;

  @Column({ nullable: true })
  description_picture?: string;

  // Add new relationship to ContentMetadata
  @OneToMany(() => ContentMetadata, (metadata) => metadata.content, {
    cascade: true,
  })
  metadataEntries: ContentMetadata[];

  @OneToMany(() => ContentRelationship, (rel) => rel.content1, {
    cascade: true,
  })
  outgoingRelationships: ContentRelationship[];

  @OneToMany(() => ContentRelationship, (rel) => rel.content2, {
    cascade: true,
  })
  incomingRelationships: ContentRelationship[];
}
