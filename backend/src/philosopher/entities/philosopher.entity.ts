import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Term } from '../../term/entities/term.entity';
import { IImages } from '../../term/entities/term.entity';
import { Question } from '@/question/entities/question.entity';

@Entity()
export class Philosopher {
  @PrimaryGeneratedColumn('uuid')
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
  @JoinTable({
    name: 'philosopher_terms',
    joinColumn: { name: 'philosopher_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'term_id', referencedColumnName: 'id' },
  })
  associatedTerms: Term[];

  @ManyToMany(() => Question, (question) => question.associatedPhilosophers)
  @JoinTable({
    name: 'philosopher_questions',
    joinColumn: { name: 'philosopher_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'question_id', referencedColumnName: 'id' },
  })
  associatedQuestions: Question[];

  @ManyToMany(() => Philosopher)
  @JoinTable({
    name: 'philosopher_related_philosophers',
    joinColumn: { name: 'philosopher_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'related_philosopher_id',
      referencedColumnName: 'id',
    },
    synchronize: false, // Add this to prevent TypeORM from trying to recreate the table
  })
  associatedPhilosophers: Philosopher[];
}
