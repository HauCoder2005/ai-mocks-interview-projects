export type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
