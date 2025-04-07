import api from "@/api/apiClient";
import {
  Content,
  ContentTypes,
  ContentWithRelations,
  CreateContent,
  MetadataDefinition,
  PaginatedResponse,
  SearchParams,
  UpdateContent,
} from "@/types";

export const contentApi = {
  /**
   * Get all content with pagination and filtering options
   */
  getAll: async (
    params: SearchParams = {}
  ): Promise<PaginatedResponse<Content>> => {
    return await api.get("content", { params });
  },

  /**
   * Get a single content item by ID
   */
  getOne: async (id: string): Promise<ContentWithRelations> => {
    return await api.get(`content/${id}`);
  },

  /**
   * Create a new content item
   */
  create: async (content: CreateContent): Promise<Content> => {
    return await api.post("content", content);
  },

  /**
   * Update an existing content item (including metadata)
   */
  update: async (id: string, content: UpdateContent): Promise<Content> => {
    return await api.patch(`content/${id}`, content);
  },

  /**
   * Delete a content item
   */
  delete: async (id: string): Promise<void> => {
    return await api.delete(`content/${id}`);
  },

  /**
   * Get related content for a specific content item
   */
  getRelated: async (id: string, type?: ContentTypes): Promise<Content[]> => {
    const params = type ? { type } : undefined;
    return await api.get(`content/${id}/related`, { params });
  },

  /**
   * Get all available content types
   */
  getContentTypes: async (): Promise<{ id: string; displayName: string }[]> => {
    return await api.get("content/types");
  },

  /**
   * Get metadata schema for a content type
   */
  getMetadataSchema: async (
    contentType: ContentTypes
  ): Promise<MetadataDefinition[]> => {
    return await api.get(`content/types/${contentType}/metadata-schema`);
  },

  /**
   * Get all metadata keys, optionally filtered by content type
   */
  getMetadataKeys: async (type?: ContentTypes): Promise<string[]> => {
    const params = type ? { type } : undefined;
    return await api.get("content/metadata-keys", { params });
  },
};
