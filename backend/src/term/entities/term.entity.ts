import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  term: string;

  @Column({ type: 'text' })
  definition: string;

  @ManyToMany(() => Philosopher, (philosopher) => philosopher.terms)
  @JoinTable()
  philosophers: Philosopher[];

  @ManyToMany(() => Question, (question) => question.terms)
  @JoinTable()
  questions: Question[];

  @Column('simple-array')
  philosophicalPeriod: string[];

  @Column('simple-array')
  philosophicalAffiliation: string[];
}
