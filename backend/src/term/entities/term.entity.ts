import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Philosopher } from '../../philosopher/entities/philosopher.entity';
import { Question } from '../../question/entities/question.entity';

@Entity()
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  term: string;

  @Column('text')
  definition: string;

  @ManyToMany(() => Philosopher, (philosopher) => philosopher.terms)
  philosophers: Philosopher[];

  @ManyToMany(() => Question, (question) => question.terms)
  questions: Question[];
}
