export type LoginRequestPayload = {
  email: string;
  password: string;
};

export type SignupRequestPayload = {
  email: string;
  password: string;
  name: string;
};

export type LoginResponse = {
  access?: string;
  refresh?: string;
  ephemeral_token?: string;
  method?: 'app';
};

export type SignupResponseDataFromServer = {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  last_login: string | null;
};

export type SignupResponseData = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  lastLogin: string | null;
};

export type ActivateMFAData = {
  details: string;
};

export type MFAMethod = 'app';
