import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Term } from '@/term/entities/term.entity';
import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToMany(
    () => Philosopher,
    (philosopher) => philosopher.associatedQuestions,
  )
  @JoinTable({ name: 'question_philosophers' })
  associatedPhilosophers: Philosopher[];

  @ManyToMany(() => Question)
  @JoinTable({
    name: 'question_related_questions',
    joinColumn: { name: 'question_id' },
    inverseJoinColumn: { name: 'related_question_id' },
  })
  associatedQuestions: Question[];

  @ManyToMany(() => Term, (term) => term.associatedQuestions)
  @JoinTable({ name: 'question_terms' })
  associatedTerms: Term[];
}
