import { ContentType } from '../content/entities/content.entity';

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
  type?: ContentType | string;
}
