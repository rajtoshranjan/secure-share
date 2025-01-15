import { useMutation } from '@tanstack/react-query';
import { StringFormatter } from '../../../lib/utils';
import api from '../setup';
import { ApiResponse } from '../types';
import { apiDataResponseMapper } from '../utils';
import {
  FileShareLinkDataFromServer,
  GenerateShareLinkPayload,
  ShareLinkResponse,
  ShareWithUserPayload,
  FileShareData,
  FileShareDataFromServer,
} from './types';

// API Functions
export const shareWithUserRequest = async (
  payload: ShareWithUserPayload,
): Promise<ApiResponse<FileShareData>> => {
  const response = await api.post<
    FileShareDataFromServer,
    ApiResponse<FileShareDataFromServer>
  >('/files/shares/', StringFormatter.convertKeysCamelCaseToSnakeCase(payload));

  return {
    ...response,
    data: apiDataResponseMapper<FileShareDataFromServer, FileShareData>(
      response.data,
    ),
  };
};

export const generateShareLinkRequest = async (
  payload: GenerateShareLinkPayload,
): Promise<ApiResponse<ShareLinkResponse>> => {
  const response = await api.post<
    FileShareLinkDataFromServer,
    ApiResponse<FileShareLinkDataFromServer>
  >('/files/links/', StringFormatter.convertKeysCamelCaseToSnakeCase(payload));

  return {
    ...response,
    data: apiDataResponseMapper<FileShareLinkDataFromServer, ShareLinkResponse>(
      response.data,
    ),
  };
};

// Hooks
export const useShareWithUser = () =>
  useMutation({
    mutationFn: shareWithUserRequest,
  });

export const useGenerateShareLink = () =>
  useMutation({
    mutationFn: generateShareLinkRequest,
  });
