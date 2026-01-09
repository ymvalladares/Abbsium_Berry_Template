import { IconPhotoShare, IconCut, IconBroadcast } from '@tabler/icons-react';

// constant
const icons = {
  IconPhotoShare,
  IconCut,
  IconBroadcast
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const contentCreator = {
  id: 'contentCreator',
  title: 'Content Creator',
  icon: icons.IconTypography,
  type: 'group',
  children: [
    {
      id: 'post',
      title: 'Post',
      type: 'item',
      url: '/platform/content/create-post',
      icon: icons.IconPhotoShare,
      breadcrumbs: false
    },
    {
      id: 'Clippings-agent',
      title: 'Clippings Agent',
      type: 'item',
      url: '/platform/content/clippings-agent',
      icon: icons.IconCut,
      breadcrumbs: false
    },
    {
      id: 'social-networks',
      title: 'Social Networks',
      type: 'item',
      url: '/platform/content/social-networks',
      icon: icons.IconBroadcast,
      breadcrumbs: false
    }
  ]
};

export default contentCreator;
