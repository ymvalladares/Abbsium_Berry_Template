import { createBrowserRouter } from 'react-router-dom';
import LandingPage from 'landing/LandingPage';
import Authentication from '../authentication/Authentication.jsx';
import ProtectedRoute from './ProtectedRoute';
import MainRoutes from './MainRoutes';
import AdminRoute from './AdminRoute.jsx';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <LandingPage />
    },
    {
      path: '/authenticate',
      element: <Authentication />
    },
    {
      path: '/platform/*', // todas las rutas bajo /platform
      element: (
        <ProtectedRoute>
          <MainRoutes.element.type {...MainRoutes.element.props} />
          <AdminRoute>// Aquí puedes agregar rutas específicas para administradores si es necesario</AdminRoute>
        </ProtectedRoute>
      ),
      children: MainRoutes.children
    }
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
