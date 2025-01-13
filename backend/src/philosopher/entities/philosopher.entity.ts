import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Term } from '@/term/entities/term.entity';
import { Question } from '@/question/entities/question.entity';

@Entity()
export class Philosopher {
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

  @Column()
  era: string;

  @Column({ nullable: true })
  birthdate?: string;

  @Column({ nullable: true })
  deathdate?: string;

  @ManyToMany(() => Term, (term) => term.relatedPhilosophers)
  @JoinTable({ name: 'philosopher_terms' })
  relatedTerms: Term[];

  @ManyToMany(() => Question, (question) => question.relatedPhilosophers)
  @JoinTable({ name: 'philosopher_questions' })
  relatedQuestions: Question[];

  @ManyToMany(() => Philosopher)
  @JoinTable({
    name: 'philosopher_related_philosophers',
    joinColumn: { name: 'philosopher_id' },
    inverseJoinColumn: { name: 'related_philosopher_id' },
  })
  relatedPhilosophers: Philosopher[];
}
