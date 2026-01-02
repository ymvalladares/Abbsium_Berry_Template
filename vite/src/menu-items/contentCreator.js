import { IconPhotoShare } from '@tabler/icons-react';
// constant
const icons = {
  IconPhotoShare
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const socialMedia = {
  id: 'social',
  title: 'Social Media',
  icon: icons.IconPhotoShare,
  type: 'group',
  children: [
    {
      id: 'content-creator',
      title: 'Content Creator',
      type: 'collapse',
      icon: icons.IconPhotoShare,
      children: [
        {
          id: 'post',
          title: 'Post',
          type: 'item',
          url: '/content/create-post',
          breadcrumbs: false
        },
        {
          id: 'Clippings-agent',
          title: 'Clippings Agent',
          type: 'item',
          url: '/content/clippings-agent',
          breadcrumbs: false
        },
        {
          id: 'social-networks',
          title: 'Social Networks',
          type: 'item',
          url: '/content/social-networks',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default socialMedia;
