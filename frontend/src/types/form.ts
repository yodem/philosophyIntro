import { ContentWithRelations } from "@/types";

export type RelationType = "philosopher" | "question" | "term";

export interface RelationConfig {
  name: RelationType;
  label: string;
  options: ContentWithRelations[]; // Replace with your ContentWithRelations type
  baseRoute: string;
}
