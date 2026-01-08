import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si no está logueado, redirige a la página de login
    return <Navigate to="/authenticate" replace />;
  }

  // Si está logueado, renderiza los hijos normalmente
  return children;
};

export default ProtectedRoute;
