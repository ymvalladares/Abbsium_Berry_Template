import { useMediaQuery, useTheme, Box } from '@mui/material';
import { ChatProvider, useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const ChatLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showChatList, selectedChat } = useChat();

  const showSidebar = !isMobile || showChatList;
  const showWindow = !isMobile || !showChatList;

  return (
    <Box sx={{
      height: { xs: 'calc(100dvh - 80px)', sm: 'calc(100vh - 175px)' },
      display: 'flex',
      p: { xs: 0, sm: 2 },
      overflow: 'hidden',
      width: '100%',
      mx: 'auto',
      position: { xs: 'fixed', sm: 'static' },
      top: { xs: '80px', sm: 'auto' },
      left: { xs: 0, sm: 'auto' },
      right: { xs: 0, sm: 'auto' },
      bottom: { xs: 0, sm: 'auto' },
      zIndex: { xs: 10, sm: 'auto' }
    }}>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', gap: 0 }}>
        {showSidebar && <ChatSidebar isMobile={isMobile} />}
        {showWindow && <ChatWindow isMobile={isMobile} />}
      </Box>
    </Box>
  );
};

const ChatApp = () => {
  const { isAdmin, isAuthenticated } = useAuth();

  return (
    <ChatProvider isAdmin={isAdmin} isAuthenticated={isAuthenticated}>
      <ChatLayout />
    </ChatProvider>
  );
};

export default ChatApp;
