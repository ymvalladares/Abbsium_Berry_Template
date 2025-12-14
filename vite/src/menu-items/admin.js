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
          id: 'sales',
          title: 'Sales',
          type: 'item',
          url: '/admin/sales',
          breadcrumbs: false
        },
        {
          id: 'earnings',
          title: 'Earnings',
          type: 'item',
          url: '/admin/earnings',
          breadcrumbs: false
        },
        {
          id: 'workers',
          title: 'Workers',
          type: 'item',
          url: '/admin/workers',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default business;
