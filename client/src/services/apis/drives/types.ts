// Server response types
import { DriveRole } from './enums';

export type DriveRoleResponse = DriveRole | 'owner';

export type DriveDataFromServer = {
  id: string;
  name: string;
  role: DriveRoleResponse;
};

export type DriveMemberDataFromServer = {
  id: string;
  drive: string;
  role: DriveRole;
  user_email: string;
  user_name: string;
};

// Client types (camelCase)
export type DriveData = {
  id: string;
  name: string;
  role: DriveRoleResponse;
};

export type DriveMemberData = {
  id: string;
  drive: string;
  role: DriveRole;
  userEmail: string;
  userName: string;
};

// Request payload types
export type CreateDrivePayload = {
  name: string;
};

export type UpdateDrivePayload = {
  id: string;
  name: string;
};

export type AddDriveMemberPayload = {
  email: string;
  role: DriveRole;
};

export type UpdateDriveMemberPayload = {
  id: string;
  role: DriveRole;
};
