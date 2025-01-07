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
  question: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Philosopher, (philosopher) => philosopher.questions)
  philosophers: Philosopher[];

  @ManyToMany(() => Term, (term) => term.questions)
  @JoinTable()
  terms: Term[];

  @Column('simple-array')
  philosophicalPeriod: string[];

  @Column('simple-array')
  philosophicalAffiliation: string[];
}
