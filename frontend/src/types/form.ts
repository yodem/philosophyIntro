import { BasicEntity, IImages } from "./index";

export interface FormInputs extends BasicEntity {
  title: string;
  content: string;
  description: string;
  images?: IImages;
  era?: string;
  birthDate?: string;
  deathDate?: string;
  associatedTerms?: BasicEntity[];
  associatedPhilosophers?: BasicEntity[];
  associatedQuestions?: BasicEntity[];
}

export interface RelationConfig {
  name: keyof FormInputs;
  label: string;
  options: BasicEntity[];
  baseRoute: string;
}
