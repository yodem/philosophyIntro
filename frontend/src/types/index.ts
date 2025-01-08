// Entity types with self-referential properties
export interface Question {
  id: number;
  question: string;
  description: string;
  terms?: Term[];
  philosophers?: Philosopher[];
}

export interface Term {
  id: number;
  term: string;
  definition: string;
  questions?: Question[];
  philosophers?: Philosopher[];
}

export interface Philosopher {
  id: number;
  name: string;
  birthYear: number;
  deathYear: number;
  description: string;
  terms?: Term[];
  questions?: Question[];
}

// Form input types
export type TermFormInputs = {
  term: string;
  definition: string;
  questions: Question[];
  philosophers: Philosopher[];
};

export type QuestionFormInputs = {
  question: string;
  description: string;
  terms: Term[];
  philosophers: Philosopher[];
};

export type PhilosopherFormInputs = {
  name: string;
  birthYear: number;
  deathYear: number;
  description: string;
  terms: Term[];
  questions: Question[];
};

// DTO types remain the same
export type UpdateTermDto = Omit<
  TermFormInputs,
  "questions" | "philosophers"
> & {
  questions: number[];
  philosophers: number[];
};

export type UpdateQuestionDto = Omit<
  QuestionFormInputs,
  "terms" | "philosophers"
> & {
  terms: number[];
  philosophers: number[];
};

export type UpdatePhilosopherDto = Omit<
  PhilosopherFormInputs,
  "terms" | "questions"
> & {
  terms: number[];
  questions: number[];
};

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface TermResponse extends Term {
  id: number;
}

export interface QuestionResponse extends Question {
  id: number;
}

export interface PhilosopherResponse extends Philosopher {
  id: number;
}
