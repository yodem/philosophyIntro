import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  term: string;

  @Column({ type: 'text' })
  definition: string;

  @ManyToMany(() => Philosopher, (philosopher) => philosopher.terms)
  philosophers: Philosopher[];

  @ManyToMany(() => Question, (question) => question.terms)
  questions: Question[];
}
