import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailVerificationWall from '../authentication/EmailVerificationWall';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { UnderMaintenance } from './error-pages';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { isUnderMaintenance } = useMaintenance();

  if (!isAuthenticated) {
    return <Navigate to="/authenticate" replace />;
  }

  if (!user?.emailConfirmed) return <EmailVerificationWall />;

  const isAdmin = user?.rol === 'Admin';

  if (isUnderMaintenance && !isAdmin) {
    return <UnderMaintenance />;
  }

  return children;
};

export default ProtectedRoute;
