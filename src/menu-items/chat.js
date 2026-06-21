// assets
import { IconMessagePlus, IconBubbleText } from '@tabler/icons-react';

// constant
const icons = {
  IconMessagePlus,
  IconBubbleText
};

// ==============================|| CHAT MENU ITEMS ||============================== //

const chat = {
  id: 'chat',
  title: 'Help & Support',
  type: 'group',
  children: [
    {
      id: 'chat',
      title: 'Chat',
      type: 'collapse',
      icon: icons.IconMessagePlus,
      children: [
        {
          id: 'chat-admin',
          title: 'Chat-To-Admin',
          type: 'item',
          url: '/platform/chat/admin',
          breadcrumbs: false
        },
        {
          id: 'chat-ai',
          title: 'Chat-AI',
          type: 'item',
          url: '/platform/chat/ai',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default chat;
