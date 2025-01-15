import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../setup';
import { ApiResponse } from '../types';
import { apiDataResponseMapper, apiPayloadMapper } from '../utils';
import {
  FileShareLinkDataFromServer,
  GenerateShareLinkPayload,
  ShareLinkResponse,
} from './types';

// API Functions
export const generateShareLinkRequest = async (
  payload: GenerateShareLinkPayload,
): Promise<ApiResponse<ShareLinkResponse>> => {
  const response = await api.post<
    FileShareLinkDataFromServer,
    ApiResponse<FileShareLinkDataFromServer>
  >('/files/links/', apiPayloadMapper(payload));

  return {
    ...response,
    data: apiDataResponseMapper<FileShareLinkDataFromServer, ShareLinkResponse>(
      response.data,
    ),
  };
};

export const fileShareLinksRequest = async (
  fileId: string,
): Promise<ApiResponse<ShareLinkResponse[]>> => {
  const response = await api.get<
    FileShareLinkDataFromServer[],
    ApiResponse<FileShareLinkDataFromServer[]>
  >(`/files/links/?file=${fileId}`);
  return {
    ...response,
    data: apiDataResponseMapper<
      FileShareLinkDataFromServer[],
      ShareLinkResponse[]
    >(response.data),
  };
};

export const revokeShareLinkRequest = async (linkId: string) =>
  await api.delete(`/files/links/${linkId}/`);

// Hooks
export const useGenerateShareLink = () =>
  useMutation({
    mutationFn: generateShareLinkRequest,
  });

export const useFileSharedLinks = (fileId: string) =>
  useQuery({
    queryKey: ['file-share-links', fileId],
    queryFn: () => fileShareLinksRequest(fileId),
  });

export const useRevokeShareLink = () =>
  useMutation({
    mutationFn: revokeShareLinkRequest,
  });
