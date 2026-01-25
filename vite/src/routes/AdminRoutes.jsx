import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import AdminRoute from './AdminRoute';

// Lazy pages
const AdminDashboard = Loadable(lazy(() => import('views/adminDashboard/Default')));
const Earnings = Loadable(lazy(() => import('views/adminDashboard/Default/Earnings')));
const Users = Loadable(lazy(() => import('views/adminDashboard/Default/users/UsersList')));

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
      path: 'users',
      element: <Users />
    }
  ]
};

export default AdminRoutes;
