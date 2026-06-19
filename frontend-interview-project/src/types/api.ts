export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type SuccessResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};
