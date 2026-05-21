import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useAuth } from '../../contexts/AuthContext';
import { useChatConnection } from '../../hooks/useChatConnection';

const ChatApp = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { isAuthenticated, isAdmin } = useAuth();

  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);

  const {
    isConnected,
    isLoading,
    messages,
    setMessages,
    conversations,
    admins,
    sendMessage,
    sendAdminReply,
    loadMessages,
  } = useChatConnection({ isAdmin, isAuthenticated });

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);

    if (isAdmin) {
      if (chat.conversationId) {
        await loadMessages(chat.conversationId);
      } else {
        setMessages([]);
      }
    } else {
      const existingConv = conversations.find((c) => c.userId === chat.id);
      if (existingConv) {
        await loadMessages(existingConv.id);
      } else {
        setMessages([]);
      }
    }

    if (isMobile) setShowChatList(false);
  };

  const handleSendMessage = async (content) => {
    if (!selectedChat) return;
    if (isAdmin) {
      if (selectedChat.conversationId) {
        await sendAdminReply(selectedChat.conversationId, content);
      }
    } else {
      await sendMessage(selectedChat.id, content);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  const showSidebar = !isMobile || showChatList;
  const showWindow = !isMobile || !showChatList;

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', p: { xs: 1.5, sm: 2.5 } }}>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', mx: 'auto', gap: 0 }}>
        {showSidebar && (
          <ChatSidebar
            isAdmin={isAdmin}
            conversations={conversations}
            admins={admins}
            isConnected={isConnected}
            isLoading={isLoading}
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChat?.id}
            isMobile={isMobile}
            standalone={!showWindow}
            outerOnly={!isMobile && showWindow}
          />
        )}

        {showWindow && (
          <ChatWindow
            isAdmin={isAdmin}
            selectedChat={selectedChat}
            messages={messages}
            isConnected={isConnected}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onBack={handleBackToList}
            isMobile={isMobile}
            standalone={!showSidebar}
            outerOnly={!isMobile && showSidebar}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChatApp;
