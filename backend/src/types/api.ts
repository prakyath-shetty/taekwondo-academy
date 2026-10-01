export interface IApiError {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
