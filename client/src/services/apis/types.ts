import { ApiErrorType } from './enums';

export type ApiMeta = {
  status_code: number;
  type: ApiErrorType;
  message?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = Record<string, any>> = {
  meta: ApiMeta;
  data: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiErrorResponse<T = Record<string, any>> = {
  meta: ApiMeta;
  data: T;
};

export type RefreshTokenResponse = {
  access: string;
};
