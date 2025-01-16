import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../setup';
import { ApiResponse } from '../types';
import { apiDataResponseMapper, apiPayloadMapper } from '../utils';
import {
  FileShareDataFromServer,
  ShareFileResponseData,
  ShareWithUserPayload,
} from './types';

// API Functions
export const shareFileWithUserRequest = async (
  payload: ShareWithUserPayload,
): Promise<ApiResponse<ShareFileResponseData>> => {
  const response = await api.post<
    FileShareDataFromServer,
    ApiResponse<FileShareDataFromServer>
  >('/files/permissions/', apiPayloadMapper(payload));

  return {
    ...response,
    data: apiDataResponseMapper<FileShareDataFromServer, ShareFileResponseData>(
      response.data,
    ),
  };
};

export const updateFilePermissionRequest = async (payload: {
  canDownload: boolean;
  id: string;
}): Promise<ApiResponse<ShareFileResponseData>> => {
  const response = await api.patch<
    FileShareDataFromServer,
    ApiResponse<FileShareDataFromServer>
  >(`/files/permissions/${payload.id}/`, apiPayloadMapper(payload));

  return {
    ...response,
    data: apiDataResponseMapper<FileShareDataFromServer, ShareFileResponseData>(
      response.data,
    ),
  };
};

export const revokeFilePermissionRequest = async (payload: { id: string }) =>
  await api.delete(`/files/permissions/${payload.id}/`);

export const getFilePermissionsRequest = async (
  fileId: string,
): Promise<ApiResponse<ShareFileResponseData[]>> => {
  const response = await api.get<
    FileShareDataFromServer[],
    ApiResponse<FileShareDataFromServer[]>
  >(`/files/permissions/?file=${fileId}`);

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
    mutationFn: shareFileWithUserRequest,
  });

export const useUpdateFilePermission = () =>
  useMutation({
    mutationFn: updateFilePermissionRequest,
  });

export const useRevokeFilePermission = () =>
  useMutation({
    mutationFn: revokeFilePermissionRequest,
  });

export const useFilePermissions = (fileId: string) =>
  useQuery({
    queryKey: ['file-permissions', fileId],
    queryFn: () => getFilePermissionsRequest(fileId),
  });
