import { routeTree } from "@/routeTree.gen";
import { ParseRoute } from "@tanstack/react-router";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export enum ContentType {
  PHILOSOPHER = "philosopher",
  QUESTION = "question",
  TERM = "term",
}

export interface Content {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  description: string;
  full_picture: string;
  description_picture: string;
  metadata?: Record<string, string>;
  philosopher?: Content[];
  question?: Content[];
  term?: Content[];
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
  type?: ContentType;
}
