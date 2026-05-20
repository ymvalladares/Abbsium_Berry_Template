import { useState, useEffect, useCallback, useRef } from 'react';
import signalRService from '../services/SignalRService';
import chatService from '../services/ChatService';
import api from '../services/AxiosService';

export const useChatConnection = ({ isAdmin, isAuthenticated }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isInitialized = useRef(false);
  const pendingMessages = useRef(new Map());
  const lastTempId = useRef(0);

  useEffect(() => {
    if (!isAuthenticated || isInitialized.current) return;
    isInitialized.current = true;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
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

    const loadData = async () => {
      setIsLoading(true);
      try {
        if (isAdmin) {
          const [convs, usersRes] = await Promise.all([
            chatService.getMyConversations(),
            api.get('/User/All-Users')
          ]);

          const allUsers = usersRes.data || [];
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

          setConversations(enrichedUsers);
        } else {
          const [adminsList, convs] = await Promise.all([chatService.getAdmins(), chatService.getMyConversations()]);

          const enrichedAdmins = adminsList.map((admin) => {
            const existingConv = convs.find((c) => c.userId === admin.id);
            return {
              ...admin,
              conversationId: existingConv?.id || null,
              lastMessage: existingConv?.lastMessage || '',
              lastMessageAt: existingConv?.lastMessageAt || null,
              unreadCount: existingConv?.unreadCount || 0,
              isOnline: false,
            };
          });

          setAdmins(enrichedAdmins);
          setConversations(convs);
        }

        await signalRService.requestOnlineUsers();
      } catch (err) {
        console.error('Error loading data:', err);
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
      setOnlineUsers(onlineIds);

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
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        isOnline ? newSet.add(userId) : newSet.delete(userId);
        return newSet;
      });

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

  // ⭐ Marcar como leídos: notificar al remitente y actualizar UI local
  useEffect(() => {
    if (!isConnected) return;

    // Alguien leyó nuestros mensajes → actualizar isRead
    const handleMessagesRead = (data) => {
      const { conversationId, messageIds } = data;
      if (!messageIds?.length) return;

      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );

      // Si la conversación ya no está seleccionada, actualizar contador
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

    // Confirmación de que nuestros mensajes se marcaron como leídos en el server
    const handleMarkedAsRead = (conversationId) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.isSender ? msg : { ...msg, isRead: true }))
      );
    };

    signalRService.on('messagesRead', handleMessagesRead);
    signalRService.on('messagesMarkedAsRead', handleMarkedAsRead);

    return () => {
      signalRService.off('messagesRead', handleMessagesRead);
      signalRService.off('messagesMarkedAsRead', handleMarkedAsRead);
    };
  }, [isConnected, isAdmin, selectedConversationId]);

  const loadMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) {
        setSelectedConversationId(null);
        setMessages([]);
        return;
      }
      try {
        setSelectedConversationId(conversationId);
        const msgs = await chatService.getMessages(conversationId);

        const enrichedMessages = msgs.map((msg) => ({
          ...msg,
          isSender: isAdmin ? msg.isAdminMessage : !msg.isAdminMessage,
        }));

        setMessages(enrichedMessages);
        await signalRService.markAsRead(conversationId);

        if (isAdmin) {
          setConversations((prev) =>
            prev.map((conv) => (conv.conversationId === conversationId ? { ...conv, unreadCount: 0 } : conv))
          );
        } else {
          setAdmins((prev) =>
            prev.map((admin) =>
              admin.conversationId === conversationId ? { ...admin, unreadCount: 0 } : admin
            )
          );
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    },
    [isAdmin]
  );

  const sendMessage = useCallback(
    async (adminId, content) => {
      if (!isConnected || !content.trim()) return;

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

      try {
        await signalRService.sendMessageToAdmin(adminId, content);
      } catch (err) {
        console.error('Error sending message:', err);
        setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
        pendingMessages.current.delete(tempId);
        throw err;
      }
    },
    [isConnected]
  );

  const sendAdminReply = useCallback(
    async (conversationId, content) => {
      if (!isConnected || !content.trim()) return;

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

      try {
        await signalRService.sendAdminReply(conversationId, content);
      } catch (err) {
        console.error('Error sending reply:', err);
        setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
        pendingMessages.current.delete(tempId);
        throw err;
      }
    },
    [isConnected]
  );

  return {
    isConnected,
    isLoading,
    messages,
    setMessages,
    conversations,
    admins,
    onlineUsers,
    sendMessage,
    sendAdminReply,
    loadMessages
  };
};
