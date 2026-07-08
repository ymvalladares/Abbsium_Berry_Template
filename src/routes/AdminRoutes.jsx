import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import AdminRoute from './AdminRoute';

// Lazy pages
const AdminDashboard = Loadable(lazy(() => import('views/adminDashboard/Default')));
//const Earnings = Loadable(lazy(() => import('views/adminDashboard/Default/Earnings')));
const Users = Loadable(lazy(() => import('views/adminDashboard/Default/users/UsersList')));
const Orders = Loadable(lazy(() => import('views/adminDashboard/Default/orders/Orders')));
const Dealers = Loadable(lazy(() => import('views/adminDashboard/Default/dealers/DealersList')));
const MaintenanceSettings = Loadable(lazy(() => import('views/adminDashboard/Default/MaintenanceSettings')));

const AdminRoutes = {
  path: 'admin',
  children: [
    {
      path: 'dashboard',
      element: <AdminDashboard />
    },
    {
      path: 'users',
      element: <Users />
    },
    {
      path: 'orders',
      element: <Orders />
    },
    {
      path: 'dealers',
      element: <Dealers />
    },
    {
      path: 'maintenance',
      element: <MaintenanceSettings />
    }
  ]
};

export default AdminRoutes;
