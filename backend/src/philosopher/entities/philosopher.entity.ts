import { Question } from '@/question/entities/question.entity';
import { Term } from '@/term/entities/term.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Philosopher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array')
  philosophicalPeriod: string[];

  @Column('simple-array')
  philosophicalAffiliation: string[];

  @ManyToMany(() => Question, (question) => question.philosophers)
  @JoinTable()
  questions: Question[];

  @ManyToMany(() => Term, (term) => term.philosophers)
  @JoinTable()
  terms: Term[];
}
