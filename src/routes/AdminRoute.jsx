import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/authenticate" state={{ from: location }} replace />;
  }

  if (user.role !== 'Admin') {
    return <Navigate to="/platform/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
