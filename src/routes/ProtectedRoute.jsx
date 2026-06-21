import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailVerificationWall from '../authentication/EmailVerificationWall';
import { UnderMaintenance } from './error-pages';

const isMaintenanceMode = () => {
  return import.meta.env.VITE_MAINTENANCE_MODE === 'true';
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isMaintenanceMode()) {
    return <UnderMaintenance />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/authenticate" replace />;
  }
  if (!user?.emailConfirmed) return <EmailVerificationWall />;

  return children;
};

export default ProtectedRoute;
