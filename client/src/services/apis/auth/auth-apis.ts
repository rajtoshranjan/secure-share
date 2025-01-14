import { useMutation } from '@tanstack/react-query';
import { ApiResponse } from '../types';

import api from '../setup';
import { apiDataResponseMapper } from '../utils';
import {
  ActivateMFAData,
  LoginRequestPayload,
  LoginResponse,
  MFAMethod,
  SignupRequestPayload,
  SignupResponseData,
  SignupResponseDataFromServer,
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
): Promise<ApiResponse<SignupResponseData>> => {
  const res = await api.post<
    SignupRequestPayload,
    ApiResponse<SignupResponseDataFromServer>
  >('/accounts/signup/', payload);

  return {
    ...res,
    data: apiDataResponseMapper<
      SignupResponseDataFromServer,
      SignupResponseData
    >(res.data),
  };
};

export const verifyMFARequest = async (payload: {
  ephemeral_token: string;
  code: string;
}): Promise<ApiResponse<LoginResponse>> => {
  const res = await api.post<LoginResponse, ApiResponse<LoginResponse>>(
    '/accounts/login/code/',
    payload,
  );
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
