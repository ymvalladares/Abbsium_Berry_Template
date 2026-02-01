import { useState, useEffect, useCallback, useRef } from 'react';
import signalRService from '../services/SignalRService';
import chatService from '../services/ChatService';

export const useChatConnection = ({ isAdmin, isAuthenticated }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isInitialized = useRef(false);
  const pendingMessages = useRef(new Map()); // ⭐ NUEVO: Mensajes pendientes

  // ========== INICIALIZAR SIGNALR (UNA SOLA VEZ) ==========
  useEffect(() => {
    if (!isAuthenticated || isInitialized.current) return;
    isInitialized.current = true;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found');
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        await signalRService.start(token);
        setIsConnected(signalRService.isConnected);
      } catch (err) {
        console.error('❌ SignalR init failed:', err);
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

  // ========== CARGAR DATOS INICIALES ==========
  useEffect(() => {
    if (!isConnected) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        if (isAdmin) {
          const convs = await chatService.getMyConversations();
          setConversations(convs);
        } else {
          const [adminsList, convs] = await Promise.all([chatService.getAdmins(), chatService.getMyConversations()]);

          const enrichedAdmins = adminsList.map((admin) => {
            const existingConv = convs.find((c) => c.userId === admin.id);

            return {
              ...admin,
              conversationId: existingConv?.id || null,
              lastMessage: existingConv?.lastMessage || 'No messages yet',
              lastMessageAt: existingConv?.lastMessageAt || null,
              unreadCount: existingConv?.unreadCount || 0,
              isOnline: false
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

  // ========== ESCUCHAR: Lista inicial de usuarios online ==========
  useEffect(() => {
    if (!isConnected) return;

    const handleOnlineUsersList = (userIds) => {
      console.log('📋 Initial online users:', userIds);

      const onlineSet = new Set(userIds);
      setOnlineUsers(onlineSet);

      if (!isAdmin) {
        setAdmins((prev) =>
          prev.map((admin) => ({
            ...admin,
            isOnline: onlineSet.has(admin.id)
          }))
        );
      }

      if (isAdmin) {
        setConversations((prev) =>
          prev.map((conv) => ({
            ...conv,
            isOnline: onlineSet.has(conv.userId)
          }))
        );
      }
    };

    signalRService.on('onlineUsersList', handleOnlineUsersList);

    return () => {
      signalRService.off('onlineUsersList', handleOnlineUsersList);
    };
  }, [isConnected, isAdmin]);

  // ========== ESCUCHAR: Cambios de estado online/offline ==========
  useEffect(() => {
    if (!isConnected) return;

    const handleUserStatusChanged = (data) => {
      const { userId, isOnline } = data;

      console.log(`👤 User ${userId} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (isOnline) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });

      if (!isAdmin) {
        setAdmins((prev) => prev.map((admin) => (admin.id === userId ? { ...admin, isOnline } : admin)));
      }

      if (isAdmin) {
        setConversations((prev) => prev.map((conv) => (conv.userId === userId ? { ...conv, isOnline } : conv)));
      }
    };

    signalRService.on('userStatusChanged', handleUserStatusChanged);

    return () => {
      signalRService.off('userStatusChanged', handleUserStatusChanged);
    };
  }, [isConnected, isAdmin]);

  // =================== EVENTOS SIGNALR PARA ADMIN ===================
  useEffect(() => {
    if (!isAdmin || !isConnected) return;

    const handleNewUserMessage = (msg) => {
      console.log('📨 Admin received USER message:', msg);

      if (msg.conversationId === selectedConversationId) {
        setMessages((prev) => {
          const exists = prev.find((m) => m.id === msg.messageId);
          if (exists) {
            console.warn('⚠️ Duplicate user message, skipping');
            return prev;
          }

          return [
            ...prev,
            {
              id: msg.messageId,
              content: msg.content,
              sentAt: msg.sentAt,
              isAdminMessage: false,
              isSender: false,
              senderName: msg.userName
            }
          ];
        });
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === msg.conversationId
            ? {
                ...conv,
                lastMessage: msg.content,
                lastMessageAt: msg.sentAt,
                unreadCount: conv.id === selectedConversationId ? 0 : (conv.unreadCount || 0) + 1
              }
            : conv
        )
      );
    };

    const handleAdminReplySent = (msg) => {
      console.log('📤 Admin reply confirmed:', msg);

      setMessages((prev) => {
        // ⭐ Buscar mensaje temporal y reemplazarlo
        const tempIndex = prev.findIndex((m) => m.tempId && pendingMessages.current.has(m.tempId));

        if (tempIndex !== -1) {
          // Reemplazar mensaje temporal con el real
          const newMessages = [...prev];
          newMessages[tempIndex] = {
            id: msg.id,
            content: msg.content,
            sentAt: msg.sentAt,
            isAdminMessage: true,
            isSender: true,
            senderName: 'You',
            isRead: false
          };

          // Limpiar pendiente
          pendingMessages.current.delete(prev[tempIndex].tempId);

          return newMessages;
        }

        // Si no hay temporal, agregar normal
        const exists = prev.find((m) => m.id === msg.id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: msg.id,
            content: msg.content,
            sentAt: msg.sentAt,
            isAdminMessage: true,
            isSender: true,
            senderName: 'You'
          }
        ];
      });

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversationId
            ? {
                ...conv,
                lastMessage: msg.content,
                lastMessageAt: msg.sentAt
              }
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
  }, [isAdmin, isConnected, selectedConversationId]);

  // =================== EVENTOS SIGNALR PARA USER ===================
  useEffect(() => {
    if (isAdmin || !isConnected) return;

    const handleMessageSent = (msg) => {
      console.log('📤 User message confirmed:', msg);

      setMessages((prev) => {
        // ⭐ Buscar mensaje temporal y reemplazarlo
        const tempIndex = prev.findIndex((m) => m.tempId && pendingMessages.current.has(m.tempId));

        if (tempIndex !== -1) {
          // Reemplazar mensaje temporal con el real
          const newMessages = [...prev];
          newMessages[tempIndex] = {
            id: msg.id,
            content: msg.content,
            sentAt: msg.sentAt,
            isAdminMessage: false,
            isSender: true,
            senderName: 'You',
            isRead: false
          };

          // Limpiar pendiente
          pendingMessages.current.delete(prev[tempIndex].tempId);

          return newMessages;
        }

        // Si no hay temporal, agregar normal
        const exists = prev.find((m) => m.id === msg.id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: msg.id,
            content: msg.content,
            sentAt: msg.sentAt,
            isAdminMessage: false,
            isSender: true,
            senderName: 'You'
          }
        ];
      });

      setAdmins((prev) =>
        prev.map((admin) =>
          admin.conversationId === selectedConversationId
            ? {
                ...admin,
                lastMessage: msg.content,
                lastMessageAt: msg.sentAt
              }
            : admin
        )
      );
    };

    const handleNewAdminMessage = (msg) => {
      console.log('📨 User received ADMIN message:', msg);

      setMessages((prev) => {
        const exists = prev.find((m) => m.id === msg.messageId);
        if (exists) {
          console.warn('⚠️ Duplicate admin message, skipping');
          return prev;
        }

        return [
          ...prev,
          {
            id: msg.messageId,
            content: msg.content,
            sentAt: msg.sentAt,
            isAdminMessage: true,
            isSender: false,
            senderName: msg.adminName
          }
        ];
      });

      setAdmins((prev) =>
        prev.map((admin) =>
          admin.conversationId === selectedConversationId
            ? {
                ...admin,
                lastMessage: msg.content,
                lastMessageAt: msg.sentAt,
                unreadCount: 0
              }
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
  }, [isAdmin, isConnected, selectedConversationId]);

  // ========== FUNCIONES ==========
  const loadMessages = useCallback(
    async (conversationId) => {
      try {
        console.log('📥 Loading messages for conversation:', conversationId);
        setSelectedConversationId(conversationId);

        const msgs = await chatService.getMessages(conversationId);

        const enrichedMessages = msgs.map((msg) => ({
          ...msg,
          isSender: isAdmin ? msg.isAdminMessage : !msg.isAdminMessage
        }));

        setMessages(enrichedMessages);
        await signalRService.markAsRead(conversationId);

        if (isAdmin) {
          setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)));
        } else {
          setAdmins((prev) => prev.map((admin) => (admin.conversationId === conversationId ? { ...admin, unreadCount: 0 } : admin)));
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

      // ⭐ CREAR MENSAJE TEMPORAL (OPTIMISTIC UPDATE)
      const tempId = `temp_${Date.now()}`;
      const tempMessage = {
        tempId,
        content,
        sentAt: new Date().toISOString(),
        isAdminMessage: false,
        isSender: true,
        senderName: 'You',
        isPending: true
      };

      // ⭐ Agregar inmediatamente al estado
      setMessages((prev) => [...prev, tempMessage]);
      pendingMessages.current.set(tempId, true);

      try {
        console.log('📤 Sending message to admin:', adminId);
        await signalRService.sendMessageToAdmin(adminId, content);
        // El evento 'messageSent' reemplazará el mensaje temporal
      } catch (err) {
        console.error('Error sending message:', err);

        // ⭐ Remover mensaje temporal si falla
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

      // ⭐ CREAR MENSAJE TEMPORAL (OPTIMISTIC UPDATE)
      const tempId = `temp_${Date.now()}`;
      const tempMessage = {
        tempId,
        content,
        sentAt: new Date().toISOString(),
        isAdminMessage: true,
        isSender: true,
        senderName: 'You',
        isPending: true
      };

      // ⭐ Agregar inmediatamente al estado
      setMessages((prev) => [...prev, tempMessage]);
      pendingMessages.current.set(tempId, true);

      try {
        console.log('📤 Sending admin reply to conversation:', conversationId);
        await signalRService.sendAdminReply(conversationId, content);
        // El evento 'adminReplySent' reemplazará el mensaje temporal
      } catch (err) {
        console.error('Error sending reply:', err);

        // ⭐ Remover mensaje temporal si falla
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
    conversations,
    admins,
    onlineUsers,
    sendMessage,
    sendAdminReply,
    loadMessages
  };
};
