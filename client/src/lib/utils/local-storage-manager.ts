import { Theme } from '../../store/enums';

export const localStorageManager = {
  // Auth.
  getToken: () => {
    return localStorage.getItem('token');
  },
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  removeToken: () => {
    localStorage.removeItem('token');
  },
  setRefreshToken: (token: string) => {
    localStorage.setItem('refreshToken', token);
  },
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },
  removeRefreshToken: () => {
    localStorage.removeItem('refreshToken');
  },
  hasToken: () => {
    return !!localStorage.getItem('token');
  },

  // Drive.
  getActiveDriveId: () => {
    return localStorage.getItem('activeDriveId');
  },
  setActiveDriveId: (id: string) => {
    localStorage.setItem('activeDriveId', id);
  },
  removeActiveDriveId: () => {
    localStorage.removeItem('activeDriveId');
  },

  // Theme.
  getTheme: () => {
    return localStorage.getItem('theme');
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme);
  },
};
