import { lazy } from 'react';

// Layout
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// Lazy pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('views/pages/authentication/Register')));
const ForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword')));
const Earnings = Loadable(lazy(() => import('views/admin/Earnings')));
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const Ai = Loadable(lazy(() => import('views/ai/Ai')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { path: '', element: <DashboardDefault /> },
    { path: 'dashboard/default', element: <DashboardDefault /> },
    { path: 'typography', element: <UtilsTypography /> },
    { path: 'color', element: <UtilsColor /> },
    { path: 'shadow', element: <UtilsShadow /> },
    { path: 'sample-page', element: <SamplePage /> },
    { path: 'users', element: <SamplePage /> },
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    { path: 'admin/earnings', element: <Earnings /> },
    { path: 'admin/sales', element: <Earnings /> },
    { path: 'admin/workers', element: <Earnings /> },
    { path: 'chat-ai', element: <Ai /> }
  ]
};

export default MainRoutes;
