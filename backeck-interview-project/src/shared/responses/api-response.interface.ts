export interface ApiResponse<TData> {
  success: boolean;
  statusCode: number;
  message: string;
  data: TData;
}

export interface ApiListMeta {
  total: number;
  itemCount: number;
}

export interface ApiResponseWithMeta<
  TData,
  TMeta extends ApiListMeta = ApiListMeta,
> {
  success: boolean;
  statusCode: number;
  message: string;
  data: TData;
  meta: TMeta;
}

export const createListMeta = (params: {
  total: number;
  itemCount: number;
}): ApiListMeta => ({
  total: params.total,
  itemCount: params.itemCount,
});