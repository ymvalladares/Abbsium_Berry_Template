import { IconBuildingWarehouse, IconTruckDelivery } from '@tabler/icons-react';

const icons = {
  IconBuildingWarehouse,
  IconTruckDelivery
};

const myDealer = {
  id: 'myDealer',
  title: 'My Dealer',
  icon: icons.IconBuildingWarehouse,
  type: 'group',
  children: [
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'collapse',
      icon: icons.IconBuildingWarehouse,
      children: [
        {
          id: 'manage-inventory',
          title: 'Manage Inventory',
          type: 'item',
          url: '/platform/dealer/inventory/manage',
          breadcrumbs: false
        },
        {
          id: 'shipping',
          title: 'Shipping',
          type: 'item',
          url: '/platform/dealer/shipping',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default myDealer;
