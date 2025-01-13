import { tokenManager, history } from '../../utils';

export const logout = () => {
  tokenManager.removeToken();
  tokenManager.removeRefreshToken();

  history.push('/');
};
