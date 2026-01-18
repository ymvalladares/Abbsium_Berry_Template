import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/authenticate" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/platform/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
