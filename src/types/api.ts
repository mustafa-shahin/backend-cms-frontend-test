export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
