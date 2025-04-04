import axios from "axios";
import {
  PaginatedResponse,
  SearchParams,
  Content,
  ContentType,
  ContentTypes,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Common function to get related content
export const getRelatedContent = async (id: string, type?: ContentType) => {
  try {
    const params = type ? { type } : {};
    const res = await api.get<Content[]>(`/content/${id}/related`, { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch related content:", error);
    return [];
  }
};

// Generic content API functions
export const contentApi = {
  getAll: async (
    params: SearchParams = { limit: 1000, page: 1, search: "" },
    type?: ContentType
  ) => {
    try {
      const queryParams = { ...params };
      if (type) queryParams.type = type;

      const res = await api.get<PaginatedResponse<Content>>("/content", {
        params: queryParams,
      });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch content:", error);
      return { items: [], total: 0, page: 1 };
    }
  },
  getOne: async (id: string) => {
    try {
      const res = await api.get<Content>(`/content/${id}`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch content:", error);
      return null;
    }
  },
  update: async (id: string, data: Partial<Content>) => {
    try {
      // Extract related content IDs from nested objects
      const relatedContentIds: string[] = [];

      // Extract related content IDs from each related content array
      ["philosopher", "question", "term"].forEach((relationType) => {
        const fieldValue = data[relationType as keyof typeof data];
        if (fieldValue && Array.isArray(fieldValue)) {
          const relatedItems = fieldValue as Content[];
          relatedItems.forEach((item) => {
            if (item?.id) relatedContentIds.push(item.id);
          });
        }
        // Remove the related arrays from the update payload as they're now in relatedContentIds
        delete data[relationType as keyof typeof data];
      });

      const res = await api.patch<Content>(`/content/${id}`, {
        ...data,
        relatedContentIds:
          relatedContentIds.length > 0 ? relatedContentIds : undefined,
      });

      return res.data;
    } catch (error) {
      console.error("Failed to update content:", error);
      throw error;
    }
  },
  create: async (data: Partial<Content>) => {
    try {
      // Extract related content IDs from nested objects
      const relatedContentIds: string[] = [];

      // Extract related content IDs from each related content array
      ["philosopher", "question", "term"].forEach((relationType) => {
        const fieldValue = data[relationType as keyof typeof data];
        if (fieldValue && Array.isArray(fieldValue)) {
          const relatedItems = fieldValue as Content[];
          relatedItems.forEach((item) => {
            if (item?.id) relatedContentIds.push(item.id);
          });
        }
        // Remove the related arrays from the create payload
        delete data[relationType as keyof typeof data];
      });

      const res = await api.post<Content>("/content", {
        ...data,
        relatedContentIds:
          relatedContentIds.length > 0 ? relatedContentIds : undefined,
      });
      return res.data;
    } catch (error) {
      console.error("Failed to create content:", error);
      throw error;
    }
  },
};

// Type-specific API functions that use the generic content API
export const philosophersApi = {
  getAll: async (
    params: SearchParams = { limit: 1000, page: 1, search: "" }
  ) => {
    return contentApi.getAll(params, ContentTypes.PHILOSOPHER);
  },
  getOne: contentApi.getOne,
  update: contentApi.update,
  create: async (data: Partial<Content>) => {
    return contentApi.create({
      ...data,
      type: ContentTypes.PHILOSOPHER,
    });
  },
};

export const questionsApi = {
  getAll: async (
    params: SearchParams = { limit: 1000, page: 1, search: "" }
  ) => {
    return contentApi.getAll(params, ContentTypes.QUESTION);
  },
  getOne: contentApi.getOne,
  update: contentApi.update,
  create: async (data: Partial<Content>) => {
    return contentApi.create({
      ...data,
      type: ContentTypes.QUESTION,
    });
  },
};

export const termsApi = {
  getAll: async (
    params: SearchParams = { limit: 1000, page: 1, search: "" }
  ) => {
    return contentApi.getAll(params, ContentTypes.TERM);
  },
  getOne: contentApi.getOne,
  update: contentApi.update,
  create: async (data: Partial<Content>) => {
    return contentApi.create({
      ...data,
      type: ContentTypes.TERM,
    });
  },
};

// New function to get available metadata keys
export const metadataApi = {
  getKeys: async (entityType?: string): Promise<string[]> => {
    try {
      const params = entityType ? { type: entityType } : {};
      const res = await api.get<string[]>("/content/metadata-keys", { params });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch metadata keys:", error);
      // Return some sensible defaults if API fails
      return [
        "era",
        "birthDate",
        "deathDate",
        "description",
        "origin",
        "language",
      ];
    }
  },
};
