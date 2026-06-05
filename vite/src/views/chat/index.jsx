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
    <Box sx={{ height: { xs: 'calc(100dvh - 64px)', sm: 'calc(100vh - 175px)' }, display: 'flex', p: { xs: 0, sm: 2.5 }, overflow: 'hidden' }}>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', mx: 'auto', gap: 0 }}>
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
