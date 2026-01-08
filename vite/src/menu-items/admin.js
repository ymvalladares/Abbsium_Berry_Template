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
          id: 'earnings',
          title: 'Earnings',
          type: 'item',
          url: '/platform/admin/earnings',
          breadcrumbs: false
        },
        {
          id: 'workers',
          title: 'Workers',
          type: 'item',
          url: '/platform/admin/workers',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default business;
