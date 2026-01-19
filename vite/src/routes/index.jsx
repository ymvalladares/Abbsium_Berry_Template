import { createBrowserRouter } from 'react-router-dom';
import LandingPage from 'landing/LandingPage';
import Authentication from '../authentication/Authentication.jsx';
import ProtectedRoute from './ProtectedRoute';
import MainRoutes from './MainRoutes';
import AdminRoutes from './AdminRoutes';

const router = createBrowserRouter(
  [
    { path: '/', element: <LandingPage /> },
    { path: '/authenticate', element: <Authentication /> },

    {
      path: '/platform',
      element: <ProtectedRoute>{MainRoutes.element}</ProtectedRoute>,
      children: [
        ...MainRoutes.children,
        AdminRoutes // 👈 aquí se montan las rutas de admin
      ]
    }
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
