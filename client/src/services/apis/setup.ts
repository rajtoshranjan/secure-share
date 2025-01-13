import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { EnvVariables } from '../../config';
import { tokenManager } from '../../utils';
import { ApiErrorType } from './enums';
import { logout } from './helpers';
import { ApiErrorResponse, ApiResponse, RefreshTokenResponse } from './types';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiErrorResponse;
    defaultSuccess: ApiResponse;
  }
}

const api = axios.create({
  baseURL: EnvVariables.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const handleRefreshToken = async () => {
  try {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      const res = await api.post<
        Record<string, string>,
        ApiResponse<RefreshTokenResponse>
      >('/accounts/token/refresh/', {
        refresh: tokenManager.getRefreshToken(),
      });

      if (res.data.access) {
        tokenManager.setToken(res.data.access);
      }
    } else {
      logout();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.meta?.type === ApiErrorType.InvalidToken) {
      logout();
    }
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_, error) => {
        if (error.meta.type === ApiErrorType.InvalidToken) {
          handleRefreshToken();
          return true;
        }
        return false;
      },
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      gcTime: 0,
    },
    mutations: {
      retry: (_, error) => {
        if (error.meta.type === ApiErrorType.InvalidToken) {
          handleRefreshToken();
          return true;
        }
        return false;
      },
    },
  },
});

export default api;
