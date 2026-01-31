// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill, IconMessagePlus } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconMessagePlus
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const chat = {
  id: 'chat',
  title: 'Chat',
  type: 'group',
  children: [
    {
      id: 'chat-admin',
      title: 'Chat-To-Admin',
      type: 'item',
      url: '/platform/chat',
      icon: icons.IconMessagePlus,
      breadcrumbs: false
    }
  ]
};

export default chat;
