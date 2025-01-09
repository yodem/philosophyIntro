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
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  era: string;

  @Column({ nullable: true })
  birthdate: string;

  @Column({ nullable: true })
  deathdate: string;

  @ManyToMany(() => Question, (question) => question.relatedPhilosophers)
  relatedQuestions: Question[];

  @ManyToMany(() => Term, (term) => term.relatedPhilosophers)
  relatedTerms: Term[];

  @ManyToMany(() => Philosopher)
  @JoinTable({
    name: 'philosopher_related_philosophers',
    joinColumn: { name: 'philosopher_id' },
    inverseJoinColumn: { name: 'related_philosopher_id' },
  })
  relatedPhilosophers: Philosopher[];
}
