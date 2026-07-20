export type ApiError = Readonly<{
  code: string;
  message: string;
  details?: Record<string, unknown>;
}>;

export type ApiEnvelope<T> = Readonly<{
  data: T;
  error?: never;
}>;

export type ApiFailure = Readonly<{
  data?: never;
  error: ApiError;
}>;

export type ApiResponse<T> = ApiEnvelope<T> | ApiFailure;
