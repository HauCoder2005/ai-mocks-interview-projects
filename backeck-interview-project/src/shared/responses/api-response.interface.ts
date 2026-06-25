export interface ApiResponse<TData> {
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