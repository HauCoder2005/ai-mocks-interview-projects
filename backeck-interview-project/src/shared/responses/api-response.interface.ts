export interface ApiResponse<TData> {
  message: string;
  data: TData;
}

export interface ApiResponseWithMeta<TData, TMeta> {
  message: string;
  data: TData;
  meta: TMeta;
}