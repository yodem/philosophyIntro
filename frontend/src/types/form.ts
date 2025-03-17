import { Content } from "@/types";

export type FormInputs = Content & {
  philosopher?: Content[];
  question?: Content[];
  term?: Content[];
};

export interface RelationConfig {
  name: keyof Pick<FormInputs, "philosopher" | "question" | "term">;
  label: string;
  options: Content[];
  baseRoute: string;
}
