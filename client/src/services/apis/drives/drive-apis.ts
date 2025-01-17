import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../types';
import api from '../setup';
import { apiDataResponseMapper } from '../utils';
import {
  DriveData,
  DriveDataFromServer,
  DriveMemberData,
  DriveMemberDataFromServer,
  CreateDrivePayload,
  UpdateDrivePayload,
  AddDriveMemberPayload,
  UpdateDriveMemberPayload,
} from './types';

// Drive API Functions
export const getDrivesRequest = async (): Promise<ApiResponse<DriveData[]>> => {
  const response = await api.get<
    DriveDataFromServer[],
    ApiResponse<DriveDataFromServer[]>
  >('/drives/');

  return {
    ...response,
    data: response.data.map((drive) =>
      apiDataResponseMapper<DriveDataFromServer, DriveData>(drive),
    ),
  };
};

export const createDriveRequest = async (
  payload: CreateDrivePayload,
): Promise<ApiResponse<DriveData>> => {
  const response = await api.post<
    DriveDataFromServer,
    ApiResponse<DriveDataFromServer>
  >('/drives/', payload);

  return {
    ...response,
    data: apiDataResponseMapper<DriveDataFromServer, DriveData>(response.data),
  };
};

export const updateDriveRequest = async (
  payload: UpdateDrivePayload,
): Promise<ApiResponse<DriveData>> => {
  const response = await api.patch<
    DriveDataFromServer,
    ApiResponse<DriveDataFromServer>
  >(`/drives/${payload.id}/`, { name: payload.name });

  return {
    ...response,
    data: apiDataResponseMapper<DriveDataFromServer, DriveData>(response.data),
  };
};

// Drive Members API Functions
export const getDriveMembersRequest = async (): Promise<
  ApiResponse<DriveMemberData[]>
> => {
  const response = await api.get<
    DriveMemberDataFromServer[],
    ApiResponse<DriveMemberDataFromServer[]>
  >('/drives/members/');

  return {
    ...response,
    data: response.data.map((member) =>
      apiDataResponseMapper<DriveMemberDataFromServer, DriveMemberData>(member),
    ),
  };
};

export const addDriveMemberRequest = async (
  payload: AddDriveMemberPayload,
): Promise<ApiResponse<DriveMemberData>> => {
  const response = await api.post<
    DriveMemberDataFromServer,
    ApiResponse<DriveMemberDataFromServer>
  >('/drives/members/', payload);

  return {
    ...response,
    data: apiDataResponseMapper<DriveMemberDataFromServer, DriveMemberData>(
      response.data,
    ),
  };
};

export const updateDriveMemberRequest = async (
  payload: UpdateDriveMemberPayload,
): Promise<ApiResponse<DriveMemberData>> => {
  const response = await api.patch<
    DriveMemberDataFromServer,
    ApiResponse<DriveMemberDataFromServer>
  >(`/drives/members/${payload.id}/`, { role: payload.role });

  return {
    ...response,
    data: apiDataResponseMapper<DriveMemberDataFromServer, DriveMemberData>(
      response.data,
    ),
  };
};

export const removeDriveMemberRequest = async (
  memberId: string,
): Promise<ApiResponse<void>> => {
  return api.delete(`/drives/members/${memberId}/`);
};

// Hooks
export const useGetDrives = (enabled: boolean = true) =>
  useQuery({
    queryKey: ['drives'],
    queryFn: getDrivesRequest,
    enabled,
  });

export const useCreateDrive = () =>
  useMutation({
    mutationFn: createDriveRequest,
  });

export const useUpdateDrive = () =>
  useMutation({
    mutationFn: updateDriveRequest,
  });

export const useGetDriveMembers = (driveId: string, enabled: boolean = true) =>
  useQuery({
    queryKey: ['drive-members', driveId],
    queryFn: () => getDriveMembersRequest(),
    enabled,
  });

export const useAddDriveMember = () =>
  useMutation({
    mutationFn: addDriveMemberRequest,
  });

export const useUpdateDriveMember = () =>
  useMutation({
    mutationFn: updateDriveMemberRequest,
  });

export const useRemoveDriveMember = () =>
  useMutation({
    mutationFn: removeDriveMemberRequest,
  });
