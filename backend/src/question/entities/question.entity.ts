import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Term } from '@/term/entities/term.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Question {
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

  @ManyToMany(() => Philosopher, (philosopher) => philosopher.relatedQuestions)
  @JoinTable({ name: 'question_philosophers' })
  relatedPhilosophers: Philosopher[];

  @ManyToMany(() => Question)
  @JoinTable({
    name: 'question_related_questions',
    joinColumn: { name: 'question_id' },
    inverseJoinColumn: { name: 'related_question_id' },
  })
  relatedQuestions: Question[];

  @ManyToMany(() => Term, (term) => term.relatedQuestions)
  @JoinTable({ name: 'question_terms' })
  relatedTerms: Term[];
}
