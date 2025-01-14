import { BasicEntity } from "./index";

export interface FormInputs extends BasicEntity {
  era?: string;
  birthDate?: string;
  deathDate?: string;
}

export interface RelationConfig {
  name: keyof FormInputs;
  label: string;
  options: BasicEntity[];
  baseRoute: string; // Add this property
}
