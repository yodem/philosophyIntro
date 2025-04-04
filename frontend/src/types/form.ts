import { Content, ContentWithRelations } from "@/types";

export type FormInputs = ContentWithRelations;

export interface RelationConfig {
  name: keyof Pick<FormInputs, "philosopher" | "question" | "term">;
  label: string;
  options: Content[];
  baseRoute: string;
}
