import {
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  Entity,
} from 'typeorm';

@Entity()
export abstract class BasicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToMany(
    () => BasicEntity,
    (philosopher) => philosopher.relatedQuestions,
    {
      cascade: true,
    },
  )
  @JoinTable({
    name: 'entity_philosophers',
  })
  relatedPhilosophers: BasicEntity[];

  @ManyToMany(() => BasicEntity, (question) => question.relatedTerms, {
    cascade: true,
  })
  @JoinTable({
    name: 'entity_questions',
  })
  relatedQuestions: BasicEntity[];

  @ManyToMany(() => BasicEntity, (term) => term.relatedQuestions, {
    cascade: true,
  })
  @JoinTable({
    name: 'entity_terms',
  })
  relatedTerms: BasicEntity[];
}
