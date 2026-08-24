import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';
import MainRoutes from './MainRoutes';
import AdminRoutes from './AdminRoutes';

const LandingPage = Loadable(lazy(() => import('landing/LandingPage')));
const Authentication = Loadable(lazy(() => import('../authentication/Authentication.jsx')));
const PricingComponent = Loadable(lazy(() => import('../landing/PricingComponent.jsx')));
const EmailConfirmed = Loadable(lazy(() => import('../authentication/EmailConfirmed.jsx')));
const ResetPassword = Loadable(lazy(() => import('../authentication/ResetPassword.jsx')));
const PrivacyPolicy = Loadable(lazy(() => import('../utils/PrivacyPolicy.jsx').then(m => ({ default: m.PrivacyPolicy }))));
const TermsOfService = Loadable(lazy(() => import('../utils/TermsOfService.jsx').then(m => ({ default: m.TermsOfService }))));
const AuthCallback = Loadable(lazy(() => import('../views/content-creator/socialNetwork/AuthCallback.jsx')));
const NotFound = Loadable(lazy(() => import('./error-pages').then(m => ({ default: m.NotFound }))));
const ErrorPage = Loadable(lazy(() => import('./error-pages').then(m => ({ default: m.ErrorPage }))));

const router = createBrowserRouter(
  [
    { path: '/', element: <LandingPage /> },
    { path: '/authenticate', element: <Authentication /> },
    { path: '/website-pricing', element: <PricingComponent /> },
    { path: '/email-confirmed', element: <EmailConfirmed /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: '/privacy-policy', element: <PrivacyPolicy /> },
    { path: '/terms', element: <TermsOfService /> },
    { path: '/auth/auth-callback', element: <AuthCallback /> },
    { path: '/auth/social-callback', element: <AuthCallback /> },

    {
      path: '/platform',
      element: <ProtectedRoute>{MainRoutes.element}</ProtectedRoute>,
      errorElement: <ErrorPage />,
      children: [...MainRoutes.children, AdminRoutes]
    },

    { path: '*', element: <NotFound /> }
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;