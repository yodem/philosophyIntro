import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';

@Entity()
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titleEn: string;

  @Column()
  titleHe: string;

  @Column({ type: 'text' })
  contentEn: string;

  @Column({ type: 'text' })
  contentHe: string;

  @ManyToMany(() => Philosopher, (philosopher) => philosopher.relatedTerms)
  @JoinTable({ name: 'term_philosophers' })
  relatedPhilosophers: Philosopher[];

  @ManyToMany(() => Question, (question) => question.relatedTerms)
  @JoinTable({ name: 'term_questions' })
  relatedQuestions: Question[];

  @ManyToMany(() => Term)
  @JoinTable({
    name: 'term_related_terms',
    joinColumn: { name: 'term_id' },
    inverseJoinColumn: { name: 'related_term_id' },
  })
  relatedTerms: Term[];
}
