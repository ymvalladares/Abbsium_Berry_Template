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
    }
  ]
};

export default utilities;
