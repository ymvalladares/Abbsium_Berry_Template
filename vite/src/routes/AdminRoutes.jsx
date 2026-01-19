import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import AdminRoute from './AdminRoute';

// Lazy pages
const AdminDashboard = Loadable(lazy(() => import('views/adminDashboard/Default')));
const Earnings = Loadable(lazy(() => import('views/adminDashboard/Default/Earnings')));
const Workers = Loadable(lazy(() => import('views/adminDashboard/Default/Workers')));

const AdminRoutes = {
  path: 'admin',
  children: [
    {
      path: 'dashboard',
      element: <AdminDashboard />
    },
    {
      path: 'earnings',
      element: <Earnings />
    },
    {
      path: 'workers',
      element: <Workers />
    }
  ]
};

export default AdminRoutes;
