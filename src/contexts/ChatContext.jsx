import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import signalRService from '../services/SignalRService';
import chatService from '../services/ChatService';
import api from '../services/AxiosService';
import { showSnackbar } from '../utils/snackbarNotif';

const ChatContext = createContext(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export const ChatProvider = ({ children, isAdmin, isAuthenticated }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [unreadBadge, setUnreadBadge] = useState(0);

  const isInitialized = useRef(false);
  const pendingMessages = useRef(new Map());
  const lastTempId = useRef(0);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || isInitialized.current) return;
    isInitialized.current = true;

    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        await signalRService.start(token);
        setIsConnected(signalRService.isConnected);
      } catch (err) {
        console.error('SignalR init failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    const handleConnectionChanged = (connected) => setIsConnected(connected);
    signalRService.on('connectionChanged', handleConnectionChanged);

    return () => {
      signalRService.off('connectionChanged', handleConnectionChanged);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isConnected) return;

    console.log('🔄 ChatContext loadData - isAdmin:', isAdmin);

    const loadData = async () => {
      setIsLoading(true);
      try {
        if (isAdmin) {
          console.log('👑 Loading admin data...');
          const [convs, usersRes] = await Promise.all([
            chatService.getMyConversations(),
            api.get('/User/All-Users')
          ]);

          console.log('📋 Conversations:', convs);
          console.log('👥 All users:', usersRes.data);

          const allUsers = (usersRes.data || []).map((u) => ({
            ...u,
            id: u.id || u.userId,
          }));
          const regularUsers = allUsers.filter(
            (u) => !u.role?.toLowerCase().includes('admin')
          );

          const enrichedUsers = regularUsers.map((user) => {
            const existingConv = convs.find((c) => c.userId === user.id);
            return {
              id: user.id,
              conversationId: existingConv?.id || null,
              userName: user.username || user.userName || user.name,
              lastMessage: existingConv?.lastMessage || '',
              lastMessageAt: existingConv?.lastMessageAt || null,
              unreadCount: existingConv?.unreadCount || 0,
              isOnline: false,
            };
          });

          console.log('✅ Enriched users for sidebar:', enrichedUsers);
          setConversations(enrichedUsers);
        } else {
          console.log('👤 Loading user data (admins list)...');
          const [adminsList, convs] = await Promise.all([chatService.getAdmins(), chatService.getMyConversations()]);

          console.log('🛡️ Admins:', adminsList);
          console.log('📋 User conversations:', convs);

          const enrichedAdmins = adminsList.map((admin) => {
            const adminId = admin.id || admin.userId || admin.adminId;
            const existingConv = convs.find((c) => c.userId === adminId);
            return {
              ...admin,
              id: adminId,
              conversationId: existingConv?.id || null,
              lastMessage: existingConv?.lastMessage || '',
              lastMessageAt: existingConv?.lastMessageAt || null,
              unreadCount: existingConv?.unreadCount || 0,
              isOnline: false,
            };
          });

          console.log('✅ Enriched admins for sidebar:', enrichedAdmins);
          setAdmins(enrichedAdmins);
          setConversations(convs);
        }

        await signalRService.requestOnlineUsers();
      } catch (err) {
        console.error('❌ Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isConnected, isAdmin]);

  useEffect(() => {
    if (!isConnected) return;

    const handleOnlineUsersList = (users) => {
      const userArray = Array.isArray(users) ? users : [];
      const onlineIds = new Set(
        userArray.map((u) => (typeof u === 'string' ? u : u.userId))
      );

      const nameMap = {};
      userArray.forEach((u) => {
        if (typeof u === 'object' && u.userId) {
          nameMap[u.userId] = u.userName || '';
        }
      });

      if (!isAdmin) {
        setAdmins((prev) =>
          prev.map((admin) => ({ ...admin, isOnline: onlineIds.has(admin.id) }))
        );
      }

      if (isAdmin) {
        setConversations((prev) =>
          prev.map((conv) => ({
            ...conv,
            isOnline: onlineIds.has(conv.id),
            userName: nameMap[conv.id] || conv.userName,
          }))
        );
      }
    };

    signalRService.on('onlineUsersList', handleOnlineUsersList);

    return () => {
      signalRService.off('onlineUsersList', handleOnlineUsersList);
    };
  }, [isConnected, isAdmin]);

  useEffect(() => {
    if (!isConnected) return;

    const handleUserStatusChanged = (data) => {
      const { userId, isOnline, userName } = data;

      if (!isAdmin) {
        setAdmins((prev) =>
          prev.map((admin) => (admin.id === userId ? { ...admin, isOnline } : admin))
        );
      }
      if (isAdmin) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === userId
              ? { ...conv, isOnline, ...(userName ? { userName } : {}) }
              : conv
          )
        );
      }
    };

    signalRService.on('userStatusChanged', handleUserStatusChanged);

    return () => {
      signalRService.off('userStatusChanged', handleUserStatusChanged);
    };
  }, [isConnected, isAdmin]);

  const confirmTempMessage = useCallback((msg, getExtraFields) => {
    setMessages((prev) => {
      const tempIndex = prev.findIndex(
        (m) => m.tempId && pendingMessages.current.has(m.tempId) && m.content === msg.content
      );

      const fallbackIndex = tempIndex === -1
        ? prev.findIndex((m) => m.tempId && pendingMessages.current.has(m.tempId))
        : tempIndex;

      if (fallbackIndex !== -1) {
        const newMessages = [...prev];
        const tempId = newMessages[fallbackIndex].tempId;
        pendingMessages.current.delete(tempId);
        newMessages[fallbackIndex] = {
          id: msg.id || msg.messageId,
          content: msg.content,
          sentAt: msg.sentAt,
          ...getExtraFields(msg),
          isRead: false,
          readAt: null,
        };
        return newMessages;
      }

      const exists = prev.find((m) => m.id === msg.id || m.id === msg.messageId);
      if (exists) return prev;

      return [
        ...prev,
        {
          id: msg.id || msg.messageId,
          content: msg.content,
          sentAt: msg.sentAt,
          ...getExtraFields(msg),
          isRead: false,
          readAt: null,
        },
      ];
    });
  }, []);

  useEffect(() => {
    if (!isAdmin || !isConnected) return;

    const handleNewUserMessage = (msg) => {
      if (msg.conversationId === selectedConversationId) {
        setMessages((prev) => {
          const exists = prev.find((m) => m.id === msg.messageId);
          if (exists) return prev;
          return [
            ...prev,
            {
              id: msg.messageId,
              content: msg.content,
              sentAt: msg.sentAt,
              isAdminMessage: false,
              isSender: false,
              senderName: msg.userName,
            },
          ];
        });
      }

      setConversations((prev) => {
        let found = false;
        const updated = prev.map((conv) => {
          if (conv.conversationId === msg.conversationId) {
            found = true;
            return {
              ...conv,
              lastMessage: msg.content,
              lastMessageAt: msg.sentAt,
              unreadCount: conv.conversationId === selectedConversationId ? 0 : (conv.unreadCount || 0) + 1,
            };
          }
          return conv;
        });

        if (!found) {
          return updated.map((conv) => {
            if (conv.id === msg.userId) {
              return {
                ...conv,
                conversationId: msg.conversationId,
                lastMessage: msg.content,
                lastMessageAt: msg.sentAt,
                unreadCount: msg.conversationId === selectedConversationId ? 0 : (conv.unreadCount || 0) + 1,
              };
            }
            return conv;
          });
        }

        return updated;
      });
    };

    const handleAdminReplySent = (msg) => {
      confirmTempMessage(msg, () => ({
        isAdminMessage: true,
        isSender: true,
        senderName: 'You',
      }));

      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversationId === selectedConversationId
            ? { ...conv, lastMessage: msg.content, lastMessageAt: msg.sentAt }
            : conv
        )
      );
    };

    signalRService.on('newUserMessage', handleNewUserMessage);
    signalRService.on('adminReplySent', handleAdminReplySent);

    return () => {
      signalRService.off('newUserMessage', handleNewUserMessage);
      signalRService.off('adminReplySent', handleAdminReplySent);
    };
  }, [isAdmin, isConnected, selectedConversationId, confirmTempMessage]);

  useEffect(() => {
    if (isAdmin || !isConnected) return;

    const handleMessageSent = (msg) => {
      confirmTempMessage(msg, () => ({
        isAdminMessage: false,
        isSender: true,
        senderName: 'You',
      }));

      setAdmins((prev) =>
        prev.map((admin) =>
          admin.conversationId === selectedConversationId
            ? { ...admin, lastMessage: msg.content, lastMessageAt: msg.sentAt }
            : admin
        )
      );
    };

    const handleNewAdminMessage = (msg) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === msg.messageId);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: msg.messageId,
            content: msg.content,
            sentAt: msg.sentAt,
            isAdminMessage: true,
            isSender: false,
            senderName: msg.adminName,
          },
        ];
      });

      setAdmins((prev) =>
        prev.map((admin) =>
          admin.conversationId === selectedConversationId
            ? { ...admin, lastMessage: msg.content, lastMessageAt: msg.sentAt, unreadCount: 0 }
            : admin
        )
      );
    };

    signalRService.on('messageSent', handleMessageSent);
    signalRService.on('newAdminMessage', handleNewAdminMessage);

    return () => {
      signalRService.off('messageSent', handleMessageSent);
      signalRService.off('newAdminMessage', handleNewAdminMessage);
    };
  }, [isAdmin, isConnected, selectedConversationId, confirmTempMessage]);

  useEffect(() => {
    if (!isConnected) return;

    const handleMessagesRead = (data) => {
      const { conversationId, messageIds, readAt } = data;
      if (!messageIds?.length) return;

      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true, readAt: readAt || new Date().toISOString() } : msg
        )
      );

      if (conversationId !== selectedConversationId) {
        if (isAdmin) {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.conversationId === conversationId ? { ...conv, unreadCount: 0 } : conv
            )
          );
        }
      }
    };

    const handleMarkedAsRead = (conversationId) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.isSender ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg))
      );
    };

    const handleMessagesReadByUser = (data) => {
      const { conversationId, messageIds, userId, readAt } = data;
      if (!messageIds?.length) return;

      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) && msg.isSender
            ? { ...msg, isRead: true, readAt: readAt || new Date().toISOString(), readBy: userId }
            : msg
        )
      );
    };

    signalRService.on('messagesRead', handleMessagesRead);
    signalRService.on('messagesMarkedAsRead', handleMarkedAsRead);
    signalRService.on('messagesReadByUser', handleMessagesReadByUser);

    return () => {
      signalRService.off('messagesRead', handleMessagesRead);
      signalRService.off('messagesMarkedAsRead', handleMarkedAsRead);
      signalRService.off('messagesReadByUser', handleMessagesReadByUser);
    };
  }, [isConnected, isAdmin, selectedConversationId]);

  // ⭐ NUEVO: Typing indicators
  useEffect(() => {
    if (!isConnected) return;

    const handleUserTyping = (data) => {
      const { conversationId, userId, isTyping } = data;
      if (conversationId === selectedConversationId) {
        setIsOtherTyping(isTyping);
      }
    };

    signalRService.on('userTyping', handleUserTyping);

    return () => {
      signalRService.off('userTyping', handleUserTyping);
    };
  }, [isConnected, selectedConversationId]);

  // ⭐ NUEVO: Message reactions
  useEffect(() => {
    if (!isConnected) return;

    const handleReactionAdded = (data) => {
      const { messageId, emoji, userId, userName } = data;
      setMessages((prev) =>
        prev.map((msg) => {
          if ((msg.id || msg.messageId) === messageId) {
            const reactions = msg.reactions || {};
            if (!reactions[emoji]) {
              reactions[emoji] = [];
            }
            if (!reactions[emoji].find((r) => r.userId === userId)) {
              reactions[emoji].push({ userId, userName });
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
    };

    const handleReactionRemoved = (data) => {
      const { messageId, emoji, userId } = data;
      setMessages((prev) =>
        prev.map((msg) => {
          if ((msg.id || msg.messageId) === messageId) {
            const reactions = msg.reactions || {};
            if (reactions[emoji]) {
              reactions[emoji] = reactions[emoji].filter((r) => r.userId !== userId);
              if (reactions[emoji].length === 0) {
                delete reactions[emoji];
              }
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
    };

    signalRService.on('messageReactionAdded', handleReactionAdded);
    signalRService.on('messageReactionRemoved', handleReactionRemoved);

    return () => {
      signalRService.off('messageReactionAdded', handleReactionAdded);
      signalRService.off('messageReactionRemoved', handleReactionRemoved);
    };
  }, [isConnected]);

  const selectChat = useCallback(async (chat) => {
    // Save current draft before switching
    if (selectedConversationId) {
      setDrafts((prev) => ({ ...prev }));
    }

    setSelectedChat(chat);
    setIsOtherTyping(false);

    const convId = chat.conversationId || chat.id;
    if (convId) {
      try {
        setSelectedConversationId(convId);
        const msgs = await chatService.getMessages(convId);

        const enrichedMessages = msgs.map((msg) => ({
          ...msg,
          isSender: isAdmin ? msg.isAdminMessage : !msg.isAdminMessage,
          isRead: msg.isRead || false,
          readAt: msg.readAt || null,
          reactions: msg.reactions || {},
        }));

        setMessages(enrichedMessages);
        await signalRService.markAsRead(convId);

        if (isAdmin) {
          setConversations((prev) =>
            prev.map((c) => (c.conversationId === convId ? { ...c, unreadCount: 0 } : c))
          );
        } else {
          setAdmins((prev) =>
            prev.map((a) =>
              a.conversationId === convId ? { ...a, unreadCount: 0 } : a
            )
          );
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setMessages([]);
      }
    } else {
      setSelectedConversationId(null);
      setMessages([]);
    }

    setShowChatList(false);
  }, [isAdmin, selectedConversationId]);

  const goBackToList = useCallback(() => {
    setShowChatList(true);
    setSelectedChat(null);
    setSelectedConversationId(null);
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || !isConnected || !selectedChat) return;

    try {
      if (isAdmin) {
        if (!selectedChat.conversationId) {
          showSnackbar('User has no active conversation. Ask them to send a message first.', 'warning');
          return;
        }

        lastTempId.current += 1;
        const tempId = `temp_${lastTempId.current}`;
        const tempMessage = {
          tempId,
          content,
          sentAt: new Date().toISOString(),
          isAdminMessage: true,
          isSender: true,
          senderName: 'You',
          isPending: true,
        };

        setMessages((prev) => [...prev, tempMessage]);
        pendingMessages.current.set(tempId, content);

        await signalRService.sendAdminReply(selectedChat.conversationId, content);
      } else {
        if (!selectedChat.id) {
          showSnackbar('Cannot send message: recipient not found', 'error');
          return;
        }

        lastTempId.current += 1;
        const tempId = `temp_${lastTempId.current}`;
        const tempMessage = {
          tempId,
          content,
          sentAt: new Date().toISOString(),
          isAdminMessage: false,
          isSender: true,
          senderName: 'You',
          isPending: true,
        };

        setMessages((prev) => [...prev, tempMessage]);
        pendingMessages.current.set(tempId, content);

        await signalRService.sendMessageToAdmin(selectedChat.id, content);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
      pendingMessages.current.delete(tempId);
      showSnackbar('Failed to send message', 'error');
    }
  }, [isAdmin, isConnected, selectedChat]);

  const deleteMessage = useCallback((msg) => {
    setMessages((prev) => prev.filter((m) => (m.id || m.tempId) !== (msg.id || msg.tempId)));
  }, []);

  // ⭐ NUEVO: Enviar typing indicator con debounce
  const sendTypingIndicator = useCallback(() => {
    if (!selectedConversationId || !isConnected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    signalRService.sendTypingIndicator(selectedConversationId);

    typingTimeoutRef.current = setTimeout(() => {
      signalRService.sendTypingIndicator(selectedConversationId);
    }, 2000);
  }, [selectedConversationId, isConnected]);

  // ⭐ NUEVO: Toggle reaction on a message
  const toggleReaction = useCallback(async (messageId, emoji) => {
    const msg = messages.find((m) => (m.id || m.messageId) === messageId);
    if (!msg) return;

    const reactions = msg.reactions || {};
    const hasReacted = reactions[emoji]?.some((r) => r.userId === 'me');

    if (hasReacted) {
      await signalRService.removeMessageReaction(messageId, emoji);
    } else {
      await signalRService.addMessageReaction(messageId, emoji);
    }
  }, [messages]);

  // ⭐ NUEVO: Save draft for current conversation
  const saveDraft = useCallback((content) => {
    if (selectedConversationId) {
      setDrafts((prev) => ({ ...prev, [selectedConversationId]: content }));
    }
  }, [selectedConversationId]);

  // ⭐ NUEVO: Get draft for current conversation
  const getDraft = useCallback(() => {
    if (selectedConversationId) {
      return drafts[selectedConversationId] || '';
    }
    return '';
  }, [selectedConversationId, drafts]);

  // ⭐ NUEVO: Clear draft for current conversation
  const clearDraft = useCallback(() => {
    if (selectedConversationId) {
      setDrafts((prev) => {
        const newDrafts = { ...prev };
        delete newDrafts[selectedConversationId];
        return newDrafts;
      });
    }
  }, [selectedConversationId]);

  // ⭐ NUEVO: Update unread badge
  const updateUnreadBadge = useCallback((count) => {
    setUnreadBadge(count);
  }, []);

  const value = {
    isAdmin,
    isConnected,
    isLoading,
    conversations,
    admins,
    messages,
    selectedChat,
    selectedConversationId,
    showChatList,
    isOtherTyping,
    unreadBadge,
    selectChat,
    goBackToList,
    sendMessage,
    deleteMessage,
    sendTypingIndicator,
    toggleReaction,
    saveDraft,
    getDraft,
    clearDraft,
    updateUnreadBadge,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
