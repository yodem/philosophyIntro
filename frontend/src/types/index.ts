import { routeTree } from "@/routeTree.gen";
import { ParseRoute } from "@tanstack/react-router";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

// Match this enum with ContentType from backend
export enum ContentTypes {
  PHILOSOPHER = "philosopher",
  TERM = "term",
  QUESTION = "question",
}

// Primary content interface that matches the backend entity
export interface Content {
  id: string;
  title: string;
  description?: string;
  type: ContentTypes;
  full_picture?: string;
  description_picture?: string;
  contentTypeDisplayName: string;
  content?: string;
  metadata?: Record<string, unknown>;
}

// Content with its related items
export interface ContentWithRelations extends Content {
  term?: Content[];
  philosopher?: Content[];
  question?: Content[];
}

// For creating new content - matches CreateContentDto
export interface CreateContent {
  title: string;
  type: ContentTypes;
  description?: string;
  content?: string;
  full_picture?: string;
  description_picture?: string;
  metadata?: Record<string, unknown>;
  relatedContentIds?: string[];
}

// For updating existing content - matches UpdateContentDto
export interface UpdateContent {
  title?: string;
  type?: ContentTypes;
  description?: string;
  content?: string;
  full_picture?: string;
  description_picture?: string;
  metadata?: Record<string, unknown>;
  relatedContentIds?: string[];
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: ContentTypes; // Make this optional
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface MetadataDefinition {
  key: string;
  displayName: string;
  dataType: "string" | "number" | "date" | "text";
  isRequired: boolean;
}

export type Sections = {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  to: ParseRoute<typeof routeTree>["fullPath"];
  type: ContentTypes;
};
