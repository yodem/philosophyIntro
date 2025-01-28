import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Term } from '../../term/entities/term.entity';
import { Question } from '@/question/entities/question.entity';

export interface IFaceImages {
  face250x250: string;
  face500x500: string;
}

export interface IFullImages {
  full600x800: string;
}

export interface IImages {
  banner400x300?: string;
  banner800x600?: string;
  faceImages?: IFaceImages;
  fullImages?: IFullImages;
}

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
  associatedQuestions: Question[];

  @ManyToMany(() => Philosopher)
  @JoinTable({
    name: 'philosopher_related_philosophers',
    joinColumn: { name: 'philosopher_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'related_philosopher_id',
      referencedColumnName: 'id',
    },
  })
  associatedPhilosophers: Philosopher[];
}
