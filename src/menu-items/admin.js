import { IconBrandPnpm, IconTool, IconUsers } from '@tabler/icons-react';

// constant
const icons = {
  IconBrandPnpm,
  IconTool,
  IconUsers
};

// ==============================|| ADMIN MENU ITEMS ||============================== //

const business = {
  id: 'buiness',
  title: 'Business',
  icon: icons.IconTool,
  type: 'group',
  children: [
    {
      id: 'admin',
      title: 'Admin',
      type: 'collapse',
      icon: icons.IconBrandPnpm,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/platform/admin/dashboard',
          breadcrumbs: false
        },

        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/platform/admin/users',
          breadcrumbs: false
        },

        {
          id: 'orders',
          title: 'Orders',
          type: 'item',
          url: '/platform/admin/orders',
          breadcrumbs: false
        },

        {
          id: 'dealers',
          title: 'Dealers',
          type: 'item',
          url: '/platform/admin/dealers',
          breadcrumbs: false
        },

        {
          id: 'maintenance',
          title: 'Maintenance',
          type: 'item',
          url: '/platform/admin/maintenance',
          breadcrumbs: false,
          icon: icons.IconTool
        }
      ]
    }
  ]
};

export default business;
