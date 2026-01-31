import React, { useState, useMemo } from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useAuth } from '../../contexts/AuthContext';
import { useChatConnection } from '../../hooks/useChatConnection';

const ChatApp = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isAuthenticated, isAdmin } = useAuth();

  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);

  const { isConnected, isLoading, messages, conversations, admins, sendMessage, sendAdminReply, loadMessages } = useChatConnection({
    isAdmin,
    isAuthenticated
  });

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);

    if (isAdmin) {
      // Admin selecciona conversación existente
      await loadMessages(chat.id);
    } else {
      // User selecciona admin
      // Buscar si ya existe conversación con ese admin
      const existingConv = conversations.find((c) => c.userId === chat.id);
      if (existingConv) {
        await loadMessages(existingConv.id);
      }
    }

    if (isMobile) setShowChatList(false);
  };

  const handleSendMessage = async (content) => {
    if (isAdmin) {
      await sendAdminReply(selectedChat.id, content);
    } else {
      await sendMessage(selectedChat.id, content);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  return (
    <Box sx={{ height: '75vh', display: 'flex', p: 2 }}>
      <Container maxWidth="xl" disableGutters sx={{ height: '100%', display: 'flex', gap: 2.5 }}>
        {(!isMobile || showChatList) && (
          <ChatSidebar
            isAdmin={isAdmin}
            conversations={conversations}
            admins={admins}
            isConnected={isConnected}
            isLoading={isLoading}
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChat?.id}
          />
        )}

        {(!isMobile || !showChatList) && (
          <ChatWindow
            isAdmin={isAdmin}
            selectedChat={selectedChat}
            messages={messages}
            isConnected={isConnected}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onBack={handleBackToList}
            isMobile={isMobile}
          />
        )}
      </Container>
    </Box>
  );
};

export default ChatApp;
