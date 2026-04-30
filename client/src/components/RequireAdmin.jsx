import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { AuthLoadingScreen } from './RequireAuth.jsx';

export function RequireAdmin({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/auth" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate replace to="/app/dashboard" />;
  }

  return children;
}
