export const tokenManager = {
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
};
