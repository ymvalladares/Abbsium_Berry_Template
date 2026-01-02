import { lazy } from 'react';

// Layout
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// Lazy pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('views/pages/authentication/Register')));
const ForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword')));
const Earnings = Loadable(lazy(() => import('views/admin/Earnings')));
const Post = Loadable(lazy(() => import('views/content-creator/post')));
const SocialNetwork = Loadable(lazy(() => import('views/content-creator/socialNetwork')));
const Ai = Loadable(lazy(() => import('views/ai/Ai')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { path: '', element: <DashboardDefault /> },
    { path: 'dashboard/default', element: <DashboardDefault /> },
    //Authentication routes
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    //Content Creator routes
    { path: 'color', element: <UtilsColor /> },
    { path: 'content/create-post', element: <Post /> },
    { path: 'content/clippings-agent', element: <SocialNetwork /> },
    { path: 'content/social-networks', element: <SocialNetwork /> },
    //Admin routes
    { path: 'admin/earnings', element: <Earnings /> },
    { path: 'admin/sales', element: <Earnings /> },
    { path: 'admin/workers', element: <Earnings /> },
    //AI routes
    { path: 'chat-ai', element: <Ai /> }
  ]
};

export default MainRoutes;
