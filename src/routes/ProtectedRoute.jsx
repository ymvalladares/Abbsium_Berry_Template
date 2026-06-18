import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailVerificationWall from '../authentication/EmailVerificationWall';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/authenticate" replace />;
  }
  if (!user?.emailConfirmed) return <EmailVerificationWall />;

  return children;
};

export default ProtectedRoute;
