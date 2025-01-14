import { Navigate, Outlet } from 'react-router-dom';
import { tokenManager } from '../../lib/utils';

export function GuestGuard() {
  const isAuthenticated = tokenManager.hasToken();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
