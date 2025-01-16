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
}
