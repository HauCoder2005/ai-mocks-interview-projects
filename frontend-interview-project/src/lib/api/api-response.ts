export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type ApiListMeta = {
  total: number;
  itemCount: number;
};

export type ApiResponseWithMeta<T> = ApiResponse<T[]> & {
  meta: ApiListMeta;
};
