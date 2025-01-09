// Entity types with self-referential properties
export interface BasicEntity {
  id: number;
  title: string;
  content: string;
  relatedPhilosophers?: Philosopher[];
  relatedQuestions?: Question[];
  relatedTerms?: Term[];
}

export interface Philosopher extends BasicEntity {
  era: string;
  birthdate?: string;
  deathdate?: string;
}

export type Question = BasicEntity;
export type Term = BasicEntity;

// DTOs for creating/updating entities
export interface CreateBasicDto {
  title: string;
  content: string;
  relatedPhilosophers?: number[];
  relatedQuestions?: number[];
  relatedTerms?: number[];
}

// Remove redundant interfaces and simplify
export interface CreatePhilosopherDto extends CreateBasicDto {
  era: string;
  birthdate?: string;
  deathdate?: string;
}

export type CreateQuestionDto = CreateBasicDto;
export type CreateTermDto = CreateBasicDto;
export type UpdateBasicDto = Partial<CreateBasicDto> & { id: number };
export type UpdatePhilosopherDto = Partial<CreatePhilosopherDto> & {
  id: number;
};
export type UpdateQuestionDto = UpdateBasicDto;
export type UpdateTermDto = UpdateBasicDto;

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
