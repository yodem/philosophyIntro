import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Philosopher } from '../../philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';

export interface IImages {
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

@Entity()
export class Term {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: true })
  images?: IImages;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Philosopher, (philosopher) => philosopher.associatedTerms)
  @JoinTable({
    name: 'term_philosophers',
    joinColumn: { name: 'term_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'philosopher_id', referencedColumnName: 'id' },
  })
  associatedPhilosophers: Philosopher[];

  @ManyToMany(() => Question, (question) => question.associatedTerms)
  associatedQuestions: Question[];

  @ManyToMany(() => Term)
  @JoinTable({
    name: 'term_related_terms',
    joinColumn: {
      name: 'term_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'related_term_id',
      referencedColumnName: 'id',
    },
  })
  associatedTerms: Term[];
}
