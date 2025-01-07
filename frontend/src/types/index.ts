export interface Philosopher {
  id: number;
  name: string;
  birthYear?: number;
  deathYear?: number;
  bio?: string;
  description: string;
  questions?: Question[];
  terms?: Term[];
}

export interface CreatePhilosopherDto {
  name: string;
  birthYear?: number;
  deathYear?: number;
  bio?: string;
  description: string;
}

export type UpdatePhilosopherDto = Partial<CreatePhilosopherDto>;

export interface Question {
  id: number;
  question: string;
  description: string;
  philosophers?: Philosopher[];
  terms?: Term[];
}

export interface CreateQuestionDto {
  question: string;
  description: string;
}

export type UpdateQuestionDto = Partial<CreateQuestionDto>;

export interface Term {
  id: number;
  term: string;
  definition: string;
  philosophers?: Philosopher[];
  questions?: Question[];
}

export interface CreateTermDto {
  term: string;
  definition: string;
}

export type UpdateTermDto = Partial<CreateTermDto>;
