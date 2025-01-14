import { Navigate, Outlet } from 'react-router-dom';
import { tokenManager } from '../../lib/utils';

export function AuthGuard() {
  const isAuthenticated = tokenManager.hasToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
