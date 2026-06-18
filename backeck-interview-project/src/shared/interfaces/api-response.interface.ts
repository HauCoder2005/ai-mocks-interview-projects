export interface ApiResponse<TData = unknown, TMeta = unknown> {
  statusCode: number;
  message: string;
  data: TData;
  meta?: TMeta;
}

export interface ResponseWithMessage<TData = unknown> {
  message?: string;
  data?: TData;
  meta?: unknown;
}
