import { lazy } from 'react';

// Layout
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AdminRoute from './AdminRoute';

// Lazy pages

//Admin
const AdminDashboard = Loadable(lazy(() => import('views/adminDashboard/Default')));
const Earnings = Loadable(lazy(() => import('views/adminDashboard/Default/Earnings')));

//User
const UserDashboard = Loadable(lazy(() => import('views/userDashboard/Dashboard')));

//Content Creator
const Post = Loadable(lazy(() => import('views/content-creator/post')));
const SocialNetwork = Loadable(lazy(() => import('views/content-creator/socialNetwork')));
const ClippingsAgent = Loadable(lazy(() => import('views/content-creator/clippingAgent')));

//AI
const Ai = Loadable(lazy(() => import('views/ai/Ai')));

const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));

const MainRoutes = {
  path: '/platform',
  element: <MainLayout />,
  children: [
    { path: '', element: <UserDashboard /> },
    { path: 'dashboard', element: <UserDashboard /> },

    //Content Creator routes
    { path: 'color', element: <UtilsColor /> },
    { path: 'content/create-post', element: <Post /> },
    { path: 'content/clippings-agent', element: <ClippingsAgent /> },
    { path: 'content/social-networks', element: <SocialNetwork /> },

    //Admin routes - Protegidas con AdminRoute
    {
      path: 'admin/dashboard',
      element: (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      )
    },
    {
      path: 'admin/earnings',
      element: (
        <AdminRoute>
          <Earnings />
        </AdminRoute>
      )
    },
    {
      path: 'admin/workers',
      element: (
        <AdminRoute>
          <Earnings />
        </AdminRoute>
      )
    },

    //AI routes
    { path: 'chat-ai', element: <Ai /> }
  ]
};

export default MainRoutes;
