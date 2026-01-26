import { IconBrandPnpm } from '@tabler/icons-react';
// assets

// constant
const icons = {
  IconBrandPnpm
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const business = {
  id: 'buiness',
  title: 'Business',
  icon: icons.IconKey,
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
        }
      ]
    }
  ]
};

export default business;
