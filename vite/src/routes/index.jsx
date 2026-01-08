import { createBrowserRouter } from 'react-router-dom';
import LandingPage from 'landing/LandingPage';
import Authentication from '../authentication/Authentication.jsx';
import ProtectedRoute from './ProtectedRoute';
import MainRoutes from './MainRoutes';

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
          {/* MainLayout y todas las rutas hijas estarán protegidas */}
          <MainRoutes.element.type {...MainRoutes.element.props} />
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
