import { useMutation, useQuery } from '@tanstack/react-query';
import { StringFormatter } from '../../../lib/utils';
import api from '../setup';
import { ApiResponse } from '../types';
import { apiDataResponseMapper, apiPayloadMapper } from '../utils';
import {
  FileShareDataFromServer,
  ShareFileResponseData,
  ShareWithUserPayload,
} from './types';

// API Functions
export const shareWithUserRequest = async (
  payload: ShareWithUserPayload,
): Promise<ApiResponse<ShareFileResponseData>> => {
  const response = await api.post<
    FileShareDataFromServer,
    ApiResponse<FileShareDataFromServer>
  >('/files/shares/', StringFormatter.convertKeysCamelCaseToSnakeCase(payload));

  return {
    ...response,
    data: apiDataResponseMapper<FileShareDataFromServer, ShareFileResponseData>(
      response.data,
    ),
  };
};

export const updateSharePermissionRequest = async (payload: {
  canDownload: boolean;
  id: string;
}): Promise<ApiResponse<ShareFileResponseData>> => {
  const response = await api.patch<
    FileShareDataFromServer,
    ApiResponse<FileShareDataFromServer>
  >(
    `/files/shares/${payload.id}/update-permission/`,
    apiPayloadMapper(payload),
  );

  return {
    ...response,
    data: apiDataResponseMapper<FileShareDataFromServer, ShareFileResponseData>(
      response.data,
    ),
  };
};

export const revokeFileShareRequest = async (payload: { id: string }) =>
  await api.delete(`/files/shares/${payload.id}/`);

export const getFileSharesRequest = async (
  fileId: string,
): Promise<ApiResponse<ShareFileResponseData[]>> => {
  const response = await api.get<
    FileShareDataFromServer[],
    ApiResponse<FileShareDataFromServer[]>
  >(`/files/shares/?file=${fileId}`);

  return {
    ...response,
    data: apiDataResponseMapper<
      FileShareDataFromServer[],
      ShareFileResponseData[]
    >(response.data),
  };
};

// Hooks
export const useShareWithUser = () =>
  useMutation({
    mutationFn: shareWithUserRequest,
  });

export const useUpdateSharePermission = () =>
  useMutation({
    mutationFn: updateSharePermissionRequest,
  });

export const useRevokeFileShare = () =>
  useMutation({
    mutationFn: revokeFileShareRequest,
  });

export const useFileShares = (fileId: string) =>
  useQuery({
    queryKey: ['file-shares', fileId],
    queryFn: () => getFileSharesRequest(fileId),
  });
