// Server response types
export type FileDataFromServer = {
  id: string;
  name: string;
  size: number;
  created_at: string;
  modified_at: string;
};

export type FileShareDataFromServer = {
  id: string;
  file: string;
  user: string;
  can_write: boolean;
  file_name: string;
  shared_with_name: string;
};

export type FileShareLinkDataFromServer = {
  id: string;
  file: string;
  slug: string;
  expires_at: string;
};

// Client types
export type FileData = {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
};

export type FileShareData = {
  id: string;
  file: string;
  user: string;
  canWrite: boolean;
  fileName: string;
  sharedWithName: string;
};

export type FileShareLinkData = {
  id: string;
  file: string;
  slug: string;
  expiresAt: string;
};

export type UploadFilePayload = {
  file: File;
};
