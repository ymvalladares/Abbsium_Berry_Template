import api from './AxiosService';

const chatService = {
  // Obtener lista de Admins (para usuarios normales)
  getAdmins: async () => {
    try {
      const response = await api.get('/Chat/admins');
      return response.data;
    } catch (error) {
      console.error('Error getting admins:', error);
      throw error;
    }
  },

  // Obtener conversaciones del usuario actual
  getMyConversations: async () => {
    try {
      const response = await api.get('/Chat/my-conversations');
      return response.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },

  // Obtener mensajes de una conversación
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/Chat/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Obtener contador de mensajes no leídos
  getUnreadCount: async () => {
    try {
      const response = await api.get('/Chat/unread-count');
      return response.data.unreadCount;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Marcar mensajes como leídos
  markAsRead: async (conversationId) => {
    try {
      await api.post(`/Chat/conversations/${conversationId}/mark-read`);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }
};

export default chatService;
