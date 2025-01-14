import { routeTree } from "@/routeTree.gen";
import { ParseRoute } from "@tanstack/react-router";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

// Entity types with self-referential properties
export interface BasicEntity {
  id: string;
  title: string;
  content: string;
  description: string;
  images?: IImages;
  associatedPhilosophers?: Philosopher[];
  associatedQuestions?: Question[];
  associatedTerms?: Term[];
}

export interface Philosopher extends BasicEntity {
  era?: string;
  birthDate?: string;
  deathDate?: string;
}

export type Question = BasicEntity;
export type Term = BasicEntity;

// DTOs for creating/updating entities
export interface CreateBasicDto {
  id: string;
  title: string;
  content: string;
  description: string;
  images?: IImages;
  associatedPhilosophers?: string[];
  associatedQuestions?: string[];
  associatedTerms?: string[];
}

export interface CreatePhilosopherDto extends CreateBasicDto {
  era?: string;
  birthDate?: string;
  deathDate?: string;
}

export type CreateQuestionDto = CreateBasicDto;
export type CreateTermDto = CreateBasicDto;
export type UpdateBasicDto = Partial<CreateBasicDto> & { id: string };
export type UpdatePhilosopherDto = Partial<CreatePhilosopherDto> & {
  id: string;
};
export type UpdateQuestionDto = UpdateBasicDto;
export type UpdateTermDto = UpdateBasicDto;

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface TermResponse extends Term {
  id: string;
}

export interface QuestionResponse extends Question {
  id: string;
}

export interface PhilosopherResponse extends Philosopher {
  id: string;
}

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

export type Sections = {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  to: ParseRoute<typeof routeTree>["fullPath"];
};
