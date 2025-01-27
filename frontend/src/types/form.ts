import { BasicEntity } from "./index";

export interface FormInputs extends BasicEntity {
  title: string;
  content: string;
  description: string;
  images: {
    banner400x300?: string;
    faceImages?: {
      face500x500?: string;
    };
  };
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
