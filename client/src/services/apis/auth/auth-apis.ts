import { useMutation } from '@tanstack/react-query';
import { ApiResponse } from '../types';

import api from '../setup';
import { apiDataResponseMapper } from '../utils';
import {
  LoginRequestPayload,
  LoginResponse,
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
    payload,
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

// Hooks.
export const useLogin = () =>
  useMutation({
    mutationFn: loginRequest,
  });

export const useSignup = () =>
  useMutation({
    mutationFn: signupRequest,
  });
