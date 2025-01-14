import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Philosopher } from '../../philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';

export interface IFaceImages {
  face250x250?: string;
  face500x500?: string;
}

export interface IFullImages {
  full600x800?: string;
}

export interface IBannerImages {
  banner400x300?: string;
  banner800x600?: string;
}

export interface IImages {
  faceImages?: IFaceImages;
  fullImages?: IFullImages;
  bannerImages?: IBannerImages;
}

@Entity()
export class Term {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: true })
  images?: IImages;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Philosopher, (philosopher) => philosopher.associatedTerms)
  @JoinTable()
  associatedPhilosophers: Philosopher[];

  @ManyToMany(() => Question, (question) => question.associatedTerms)
  @JoinTable({})
  associatedQuestions: Question[];

  @ManyToMany(() => Term, (term) => term.associatedTerms)
  @JoinTable({})
  associatedTerms: Term[];
}
