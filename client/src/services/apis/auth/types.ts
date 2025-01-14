export type LoginRequestPayload = {
  email: string;
  password: string;
};

export type SignupRequestPayload = {
  email: string;
  password: string;
  name: string;
};

export type LoginMFAverifyResponse = {
  access: string;
  refresh: string;
};

export type LoginResponse =
  | LoginMFAverifyResponse
  | {
      ephemeral_token: string;
      method: 'app';
    };

export type UserInfo = {
  email: string;
  name: string;
};

export type ActivateMFAData = {
  details: string;
};

export type MFAMethod = 'app';

export type MFAMethodInfoFromServer = {
  name: MFAMethod;
  is_primary: boolean;
};

export type MFAMethodInfo = {
  name: MFAMethod;
  isPrimary: boolean;
};
