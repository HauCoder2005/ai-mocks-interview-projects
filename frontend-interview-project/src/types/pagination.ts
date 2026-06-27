export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};
