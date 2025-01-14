import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../types';
import api from '../setup';
import { apiDataResponseMapper } from '../utils';
import { FileData, FileDataFromServer, UploadFilePayload } from './types';

// API Functions
export const getFilesRequest = async (): Promise<ApiResponse<FileData[]>> => {
  const response = await api.get<
    FileDataFromServer[],
    ApiResponse<FileDataFromServer[]>
  >('/files/');

  return {
    ...response,
    data: response.data.map((file) =>
      apiDataResponseMapper<FileDataFromServer, FileData>(file),
    ),
  };
};

export const uploadFileRequest = async (
  payload: UploadFilePayload,
): Promise<ApiResponse<FileData>> => {
  const formData = new FormData();
  formData.append('file', payload.file);

  const response = await api.post<
    FileDataFromServer,
    ApiResponse<FileDataFromServer>
  >('/files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return {
    ...response,
    data: apiDataResponseMapper<FileDataFromServer, FileData>(response.data),
  };
};

export const deleteFileRequest = async (
  fileId: string,
): Promise<ApiResponse<void>> => {
  return api.delete(`/files/${fileId}/`);
};

export const downloadFileRequest = async (fileId: string): Promise<Blob> => {
  return await api.get(`/files/${fileId}/download/`, {
    responseType: 'blob',
  });
};

// Hooks
export const useGetFiles = () =>
  useQuery({
    queryKey: ['files'],
    queryFn: getFilesRequest,
  });

export const useUploadFile = () =>
  useMutation({
    mutationFn: uploadFileRequest,
  });

export const useDeleteFile = () =>
  useMutation({
    mutationFn: deleteFileRequest,
  });

export const useDownloadFile = () =>
  useMutation({
    mutationFn: downloadFileRequest,
  });
