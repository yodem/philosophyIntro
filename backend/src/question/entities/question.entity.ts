import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Term, IImages } from '@/term/entities/term.entity';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true })
  images: IImages;

  @ManyToMany(
    () => Philosopher,
    (philosopher) => philosopher.associatedQuestions,
  )
  @JoinTable({
    name: 'question_philosophers',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'philosopher_id', referencedColumnName: 'id' },
  })
  associatedPhilosophers: Philosopher[];

  @ManyToMany(() => Question)
  @JoinTable({
    name: 'question_related_questions',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'related_question_id',
      referencedColumnName: 'id',
    },
    synchronize: false,
  })
  associatedQuestions: Question[];

  @ManyToMany(() => Term, (term) => term.associatedQuestions)
  @JoinTable({
    name: 'question_terms',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'term_id', referencedColumnName: 'id' },
  })
  associatedTerms: Term[];
}
