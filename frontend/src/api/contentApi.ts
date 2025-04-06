import api from "@/api/apiClient";
import {
  ContentTypes,
  ContentWithRelations,
  PaginatedResponse,
  SearchParams,
  UpdateContent,
} from "@/types";

export const contentApi = {
  getAll: async (
    params: SearchParams
  ): Promise<PaginatedResponse<ContentWithRelations>> => {
    // No need for special endpoints - backend handles filtering by type
    return await api.get("content", { params });
  },

  getOne: async (
    id: string,
    type?: ContentTypes
  ): Promise<ContentWithRelations> => {
    // Use single endpoint as backend handles all content types
    const params = type ? { type } : undefined;
    return await api.get(`content/${id}`, { params });
  },

  create: async (
    content: Partial<ContentWithRelations>
  ): Promise<ContentWithRelations> => {
    return await api.post("content", content);
  },

  update: async (
    id: string,
    content: UpdateContent
  ): Promise<ContentWithRelations> => {
    return await api.patch(`content/${id}`, content);
  },

  delete: async (id: string): Promise<void> => {
    return await api.delete(`content/${id}`);
  },

  getRelated: async (
    id: string,
    type?: ContentTypes
  ): Promise<ContentWithRelations[]> => {
    const params = type ? { type } : undefined;
    return await api.get(`content/${id}/related`, { params });
  },
};
