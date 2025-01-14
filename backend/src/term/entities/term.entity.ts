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
  @JoinTable({
    name: 'term_philosophers',
    joinColumn: { name: 'term_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'philosopher_id', referencedColumnName: 'id' },
  })
  associatedPhilosophers: Philosopher[];

  @ManyToMany(() => Question, (question) => question.associatedTerms)
  @JoinTable({
    name: 'term_questions',
    joinColumn: { name: 'term_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'question_id', referencedColumnName: 'id' },
  })
  associatedQuestions: Question[];

  @ManyToMany(() => Term, (term) => term.associatedTerms)
  @JoinTable({
    name: 'term_related_terms',
    joinColumn: { name: 'term_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'related_term_id', referencedColumnName: 'id' },
  })
  associatedTerms: Term[];
}
