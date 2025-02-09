import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../types';

import api from '../setup';
import { StringFormatter } from '../../../lib/utils';
import {
  ActivateMFAData,
  LoginRequestPayload,
  LoginResponse,
  MFAMethod,
  SignupRequestPayload,
  UserInfo,
  MFAMethodInfo,
  MFAMethodInfoFromServer,
  LoginMFAverifyResponse,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from './types';

// APIs.
export const loginRequest = async (
  payload: LoginRequestPayload,
): Promise<ApiResponse<LoginResponse>> => {
  const res = await api.post<LoginResponse, ApiResponse<LoginResponse>>(
    '/accounts/login/',
    {
      username: payload.email,
      password: payload.password,
    },
  );
  return res;
};

export const signupRequest = async (
  payload: SignupRequestPayload,
): Promise<ApiResponse<UserInfo>> => {
  return await api.post<UserInfo, ApiResponse<UserInfo>>('/accounts/', payload);
};

export const verifyMFARequest = async (payload: {
  ephemeral_token: string;
  code: string;
}): Promise<ApiResponse<LoginMFAverifyResponse>> => {
  const res = await api.post<
    LoginResponse,
    ApiResponse<LoginMFAverifyResponse>
  >('/accounts/login/code/', payload);
  return res;
};

export const activateMFARequest = async (
  method: MFAMethod,
): Promise<ApiResponse<ActivateMFAData>> => {
  const res = await api.post<string, ApiResponse<ActivateMFAData>>(
    `/accounts/mfa/${method}/activate/`,
  );
  return res;
};

export const confirmMFARequest = async (payload: {
  method: MFAMethod;
  code: string;
}): Promise<ApiResponse<{ backup_codes: number[] }>> => {
  const res = await api.post<
    { code: string },
    ApiResponse<{ backup_codes: number[] }>
  >(`/accounts/mfa/${payload.method}/activate/confirm/`, {
    code: payload.code,
  });
  return res;
};

export const getActiveMFAMethodsRequest = async (): Promise<
  ApiResponse<MFAMethodInfo[]>
> => {
  const res = await api.get<
    MFAMethodInfoFromServer[],
    ApiResponse<MFAMethodInfoFromServer[]>
  >('/accounts/mfa/mfa/user-active-methods/');

  return {
    ...res,
    data: res.data.map((method) => ({
      name: method.name,
      isPrimary: method.is_primary,
    })),
  };
};

export const deactivateMFARequest = async (payload: {
  method: MFAMethod;
  code: string;
}): Promise<ApiResponse<void>> => {
  return api.post(`/accounts/mfa/${payload.method}/deactivate/`, {
    code: payload.code,
  });
};

export const logoutRequest = async (payload: {
  refreshToken: string;
}): Promise<ApiResponse> => {
  return await api.post<any, ApiResponse>('/accounts/logout/', {
    refresh_token: payload.refreshToken,
  });
};

export const getUserInfoRequest = async (): Promise<ApiResponse<UserInfo>> => {
  return await api.get<UserInfo, ApiResponse<UserInfo>>('/accounts/me/');
};

export const updateProfileRequest = async (
  payload: UpdateProfilePayload,
): Promise<ApiResponse<UserInfo>> => {
  return await api.patch<UserInfo, ApiResponse<UserInfo>>(
    '/accounts/me/',
    StringFormatter.convertKeysCamelCaseToSnakeCase(payload),
  );
};
export const changePasswordRequest = async (
  payload: ChangePasswordPayload,
): Promise<ApiResponse<void>> => {
  return await api.post(
    '/accounts/change-password/',
    StringFormatter.convertKeysCamelCaseToSnakeCase(payload),
  );
};

// Hooks.
export const useLogin = () =>
  useMutation({
    mutationFn: loginRequest,
  });

export const useSignup = () =>
  useMutation({
    mutationFn: signupRequest,
  });

export const useVerifyMFA = () =>
  useMutation({
    mutationFn: verifyMFARequest,
  });

export const useActivateMFA = () =>
  useMutation({
    mutationFn: activateMFARequest,
  });

export const useConfirmMFA = () =>
  useMutation({
    mutationFn: confirmMFARequest,
  });

export const useGetActiveMFAMethods = () =>
  useQuery({
    queryKey: ['activeMFAMethods'],
    queryFn: getActiveMFAMethodsRequest,
  });

export const useDeactivateMFA = () =>
  useMutation({
    mutationFn: deactivateMFARequest,
  });

export const useLogout = () =>
  useMutation({
    mutationFn: logoutRequest,
    retry: false,
  });

export const useGetUserInfo = () =>
  useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfoRequest,
  });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: updateProfileRequest,
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: changePasswordRequest,
  });
