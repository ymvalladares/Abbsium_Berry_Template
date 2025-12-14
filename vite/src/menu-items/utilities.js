// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill, IconBubbleText } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconBubbleText
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'ai',
      title: 'Chat-AI',
      type: 'item',
      url: '/chat-ai',
      icon: icons.IconBubbleText,
      breadcrumbs: false
    },
    {
      id: 'util-color',
      title: 'Color',
      type: 'item',
      url: '/color',
      icon: icons.IconPalette,
      breadcrumbs: false
    },
    {
      id: 'util-user',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.IconShadow,
      breadcrumbs: false
    }
  ]
};

export default utilities;
