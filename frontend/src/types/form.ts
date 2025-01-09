import { BasicEntity, Philosopher, Question, Term } from "./index";

export type BasicFormInputs = BasicEntity;

export type PhilosopherFormInputs = Philosopher;
export type QuestionFormInputs = BasicFormInputs;

export type TermFormInputs = BasicFormInputs;

export interface RelationConfig<T> {
  name: keyof BasicFormInputs;
  label: string;
  options: T[];
}

export type EntityRelation = RelationConfig<Term | Question | Philosopher>;
