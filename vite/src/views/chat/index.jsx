import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useAuth } from '../../contexts/AuthContext';
import { useChatConnection } from '../../hooks/useChatConnection';
import { showSnackbar } from '../../utils/snackbarNotif';

const ChatApp = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { isAuthenticated, isAdmin } = useAuth();

  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);

  const { isConnected, isLoading, messages, setMessages, conversations, admins, sendMessage, sendAdminReply, loadMessages } =
    useChatConnection({ isAdmin, isAuthenticated });

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);

    const targetId = chat.id;
    const existingConv = !isAdmin
      ? conversations.find((c) => c.userId === targetId)
      : null;
    const convId = existingConv?.id || chat.conversationId;

    if (convId) {
      await loadMessages(convId);
    } else {
      setMessages([]);
    }

    if (isMobile) setShowChatList(false);
  };

  const handleDeleteMessage = (msg) => {
    setMessages((prev) => prev.filter((m) => (m.id || m.tempId) !== (msg.id || msg.tempId)));
  };

  const handleSendMessage = async (content) => {
    if (!selectedChat) return;
    try {
      if (isAdmin) {
        if (!selectedChat.conversationId) {
          showSnackbar('User has no active conversation. Ask them to send a message first.', 'warning');
          return;
        }
        await sendAdminReply(selectedChat.conversationId, content);
      } else {
        if (!selectedChat.id) {
          showSnackbar('Cannot send message: recipient not found', 'error');
          return;
        }
        await sendMessage(selectedChat.id, content);
      }
    } catch (err) {
      showSnackbar('Failed to send message', 'error');
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  const showSidebar = !isMobile || showChatList;
  const showWindow = !isMobile || !showChatList;

  return (
    <Box sx={{ height: { xs: 'calc(100dvh - 165px)', sm: 'calc(100vh - 175px)' }, display: 'flex', p: { xs: 1, sm: 2.5 }, overflow: 'hidden' }}>
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
            setMessages={setMessages}
            isConnected={isConnected}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onDeleteMessage={handleDeleteMessage}
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
