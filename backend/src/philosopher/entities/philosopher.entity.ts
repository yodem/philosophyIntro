import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Term } from '../../term/entities/term.entity';
import { IImages } from '../../term/entities/term.entity';
import { Question } from '@/question/entities/question.entity';

@Entity()
export class Philosopher {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: true })
  images: IImages;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  deathDate: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  era: string;

  @ManyToMany(() => Term, (term) => term.associatedPhilosophers)
  associatedTerms: Term[];

  @ManyToMany(() => Question, (question) => question.associatedPhilosophers)
  associatedQuestions: Question[];

  @ManyToMany(
    () => Philosopher,
    (philosopher) => philosopher.associatedPhilosophers,
  )
  associatedPhilosophers: Philosopher[];
}
