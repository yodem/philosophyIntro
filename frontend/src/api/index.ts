import { contentApi } from "./contentApi";
import {
  Content,
  ContentTypes,
  PaginatedResponse,
  SearchParams,
} from "@/types";

// Export the main contentApi
export { contentApi };

// Type-specific API helpers that use the generic contentApi
export const philosophersApi = {
  getAll: async (
    params: SearchParams = {}
  ): Promise<PaginatedResponse<Content>> => {
    return contentApi.getAll({ ...params, type: ContentTypes.PHILOSOPHER });
  },
  getOne: contentApi.getOne,
  update: contentApi.update,
  create: async (data: Omit<Content, "type">): Promise<Content> => {
    return contentApi.create({
      ...data,
      type: ContentTypes.PHILOSOPHER,
    });
  },
  delete: contentApi.delete,
};

export const questionsApi = {
  getAll: async (
    params: SearchParams = {}
  ): Promise<PaginatedResponse<Content>> => {
    return contentApi.getAll({ ...params, type: ContentTypes.QUESTION });
  },
  getOne: contentApi.getOne,
  update: contentApi.update,
  create: async (data: Omit<Content, "type">): Promise<Content> => {
    return contentApi.create({
      ...data,
      type: ContentTypes.QUESTION,
    });
  },
  delete: contentApi.delete,
};

export const termsApi = {
  getAll: async (
    params: SearchParams = {}
  ): Promise<PaginatedResponse<Content>> => {
    return contentApi.getAll({ ...params, type: ContentTypes.TERM });
  },
  getOne: contentApi.getOne,
  update: contentApi.update,
  create: async (data: Omit<Content, "type">): Promise<Content> => {
    return contentApi.create({
      ...data,
      type: ContentTypes.TERM,
    });
  },
  delete: contentApi.delete,
};

// Metadata helpers
export const metadataApi = {
  getKeys: contentApi.getMetadataKeys,
  getSchema: contentApi.getMetadataSchema,
};
