import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/authenticate" replace />;
  }

  if (user?.rol !== 'Admin') {
    return <Navigate to="/platform/dashboard" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
