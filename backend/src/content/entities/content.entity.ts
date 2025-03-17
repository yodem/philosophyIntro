import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ContentRelationship } from './contentRelationship.entity';

export enum ContentType {
  PHILOSOPHER = 'philosopher',
  QUESTION = 'question',
  TERM = 'term',
}

export interface Images {
  faceImages?: {
    face250x250?: string;
    face500x500?: string;
  };
  fullImages?: {
    full600x800?: string;
  };
  banner400x300?: string;
  banner800x600?: string;
}

export interface PhilosopherMetadata {
  images?: Images;
  birthDate?: string;
  deathDate?: string;
  era?: string;
}

export interface TermMetadata {
  images?: Images;
}

export type ContentMetadata = PhilosopherMetadata | TermMetadata;

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
  metadata: ContentMetadata;

  @Column({ nullable: true })
  full_picture?: string;

  @Column({ nullable: true })
  description_picture?: string;

  @OneToMany(() => ContentRelationship, (rel) => rel.content1, {
    cascade: true,
  })
  outgoingRelationships: ContentRelationship[];

  @OneToMany(() => ContentRelationship, (rel) => rel.content2, {
    cascade: true,
  })
  incomingRelationships: ContentRelationship[];
}
