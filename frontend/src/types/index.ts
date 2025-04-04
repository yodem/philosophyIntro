import { routeTree } from "@/routeTree.gen";
import { ParseRoute } from "@tanstack/react-router";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export enum ContentTypes {
  PHILOSOPHER = "philosopher",
  TERM = "term",
  QUESTION = "question",
}

export interface ContentWithRelations {
  id: string;
  title: string;
  description?: string;
  type: ContentTypes;
  metadata?: Record<string, unknown>;
  relatedContent?: ContentWithRelations[];
  relatedContentIds?: string[];
}

export type CreateContent = {
  title: string;
  content: string;
  description: string;
  full_picture: string;
  description_picture: string;
  philosopher?: string[];
  question?: string[];
  term?: string[];
};

export type UpdateContent = Partial<CreateContent> & {
  id: string;
};

export type Sections = {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  to: ParseRoute<typeof routeTree>["fullPath"];
  type: ContentTypes;
};

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  type: ContentTypes;
}
