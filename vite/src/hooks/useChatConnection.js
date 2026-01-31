import { useState, useEffect, useCallback, useRef } from 'react';
import signalRService from '../services/SignalRService';
import chatService from '../services/ChatService';

export const useChatConnection = ({ isAdmin, isAuthenticated }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isInitialized = useRef(false);

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
          // Admin: cargar conversaciones existentes
          const convs = await chatService.getMyConversations();
          setConversations(convs);
        } else {
          // User: cargar lista de admins y conversaciones
          const [adminsList, convs] = await Promise.all([chatService.getAdmins(), chatService.getMyConversations()]);

          setAdmins(adminsList);
          setConversations(convs);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isConnected, isAdmin]);

  // ========== EVENTOS SIGNALR PARA USER ==========
  useEffect(() => {
    if (isAdmin || !isConnected) return;

    const handleMessageSent = (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          content: msg.content,
          sentAt: msg.sentAt,
          isAdminMessage: false,
          isSender: true,
          senderName: 'You'
        }
      ]);
    };

    const handleNewAdminMessage = (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.messageId,
          content: msg.content,
          sentAt: msg.sentAt,
          isAdminMessage: true,
          isSender: false,
          senderName: msg.adminName
        }
      ]);

      // Actualizar conversaciones
      loadConversations();
    };

    signalRService.on('messageSent', handleMessageSent);
    signalRService.on('newAdminMessage', handleNewAdminMessage);

    return () => {
      signalRService.off('messageSent', handleMessageSent);
      signalRService.off('newAdminMessage', handleNewAdminMessage);
    };
  }, [isAdmin, isConnected]);

  // ========== EVENTOS SIGNALR PARA ADMIN ==========
  useEffect(() => {
    if (!isAdmin || !isConnected) return;

    const handleNewUserMessage = async (msg) => {
      // Si es de la conversación actual, agregar mensaje
      if (msg.conversationId === selectedConversationId) {
        setMessages((prev) => [
          ...prev,
          {
            id: msg.messageId,
            content: msg.content,
            sentAt: msg.sentAt,
            isAdminMessage: false,
            isSender: false,
            senderName: msg.userName
          }
        ]);
      }

      // Actualizar lista de conversaciones
      loadConversations();
    };

    const handleAdminReplySent = (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          content: msg.content,
          sentAt: msg.sentAt,
          isAdminMessage: true,
          isSender: true,
          senderName: 'You'
        }
      ]);
    };

    signalRService.on('newUserMessage', handleNewUserMessage);
    signalRService.on('adminReplySent', handleAdminReplySent);

    return () => {
      signalRService.off('newUserMessage', handleNewUserMessage);
      signalRService.off('adminReplySent', handleAdminReplySent);
    };
  }, [isAdmin, isConnected, selectedConversationId]);

  // ========== FUNCIONES ==========
  const loadConversations = async () => {
    try {
      const convs = await chatService.getMyConversations();
      setConversations(convs);
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const loadMessages = useCallback(async (conversationId) => {
    try {
      setSelectedConversationId(conversationId);
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs);
      await signalRService.markAsRead(conversationId);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  }, []);

  const sendMessage = useCallback(
    async (adminId, content) => {
      if (!isConnected || !content.trim()) return;
      try {
        await signalRService.sendMessageToAdmin(adminId, content);
      } catch (err) {
        console.error('Error sending message:', err);
        throw err;
      }
    },
    [isConnected]
  );

  const sendAdminReply = useCallback(
    async (conversationId, content) => {
      if (!isConnected || !content.trim()) return;
      try {
        await signalRService.sendAdminReply(conversationId, content);
      } catch (err) {
        console.error('Error sending reply:', err);
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
    sendMessage,
    sendAdminReply,
    loadMessages
  };
};
