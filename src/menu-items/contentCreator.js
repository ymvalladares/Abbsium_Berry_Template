import { IconPhotoShare } from '@tabler/icons-react';

// constant
const icons = {
  IconPhotoShare
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const contentCreator = {
  id: 'contentCreator',
  title: 'Content Creator',
  icon: icons.IconTypography,
  type: 'group',
  children: [
    {
      id: 'content',
      title: 'Content',
      type: 'collapse',
      icon: icons.IconPhotoShare,
      children: [
        {
          id: 'post',
          title: 'Post',
          type: 'item',
          url: '/platform/content/post',
          breadcrumbs: false
        },
        {
          id: 'clippings-agent',
          title: 'Clippings Agent',
          type: 'item',
          url: '/platform/content/clippings-agent',
          breadcrumbs: false
        },
        {
          id: 'social-networks',
          title: 'Social Networks',
          type: 'item',
          url: '/platform/content/social-networks',
          breadcrumbs: false
        },
        {
          id: 'calendar',
          title: 'Calendar',
          type: 'item',
          url: '/platform/content/calendar',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default contentCreator;
