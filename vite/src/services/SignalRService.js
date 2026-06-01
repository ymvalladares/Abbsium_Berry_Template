import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.listeners = {};
    this.isInitializing = false;
  }

  async start(token, baseURL = import.meta.env.VITE_API_URL) {
    if (this.isInitializing) {
      console.warn('⚠️ SignalR is already initializing');
      return;
    }

    if (this.connection && this.isConnected) {
      console.warn('✅ SignalR already connected');
      return;
    }

    this.isInitializing = true;

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseURL}hubs/chat`, {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets,
          // ⭐ AGREGAR TIMEOUTS
          timeout: 60000 // 60 segundos (debe coincidir con backend)
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Backoff exponencial: 0s, 2s, 10s, 30s, luego 30s siempre
            if (retryContext.elapsedMilliseconds < 60000) {
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
            }
            return null; // Dejar de intentar después de 1 minuto
          }
        })
        .withServerTimeout(60000) // ⭐ NUEVO: Tiempo de espera del servidor
        .withKeepAliveInterval(15000) // ⭐ NUEVO: Intervalo de keep-alive
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.connection.onreconnecting((error) => {
        console.log('🔄 Reconnecting...', error);
        this.isConnected = false;
        this.emit('connectionChanged', false);
      });

      this.connection.onreconnected((connectionId) => {
        console.log('✅ Reconnected:', connectionId);
        this.isConnected = true;
        this.emit('connectionChanged', true);

        // ⭐ SOLICITAR usuarios online después de reconectar
        this.requestOnlineUsers();
      });

      this.connection.onclose((error) => {
        console.log('❌ Connection closed:', error);
        this.isConnected = false;
        this.isInitializing = false;
        this.emit('connectionChanged', false);
      });

      this.registerServerEvents();

      await this.connection.start();
      console.log('✅ Connected to SignalR Hub');
      this.isConnected = true;
      this.isInitializing = false;
      this.emit('connectionChanged', true);
    } catch (error) {
      console.error('❌ SignalR Connection Error:', error);
      this.isConnected = false;
      this.isInitializing = false;
      this.connection = null;
      throw error;
    }
  }

  registerServerEvents() {
    if (!this.connection) return;

    // Usuario: Confirmación de mensaje enviado
    this.connection.on('messageSent', (message) => {
      console.log('🔔 SignalR EVENT RECEIVED: messageSent', message);
      this.emit('messageSent', message);
    });

    // Usuario: Nuevo mensaje de admin
    this.connection.on('newAdminMessage', (message) => {
      console.log('🔔 SignalR EVENT RECEIVED: newAdminMessage', message);
      this.emit('newAdminMessage', message);
      this.playNotificationSound();
    });

    // Admin: Nuevo mensaje de usuario
    this.connection.on('newUserMessage', (message) => {
      console.log('🔔 SignalR EVENT RECEIVED: newUserMessage', message);
      this.emit('newUserMessage', message);
      this.playNotificationSound();
    });

    // Admin: Confirmación de respuesta
    this.connection.on('adminReplySent', (message) => {
      console.log('🔔 SignalR EVENT RECEIVED: adminReplySent', message);
      this.emit('adminReplySent', message);
    });

    // Mensajes marcados como leídos
    this.connection.on('messagesMarkedAsRead', (conversationId) => {
      console.log('✅ Messages marked as read:', conversationId);
      this.emit('messagesMarkedAsRead', conversationId);
    });

    // ⭐ NUEVO: Mensajes vistos por el usuario (read receipts)
    this.connection.on('messagesReadByUser', (data) => {
      console.log('👁️ Messages read by user:', data);
      this.emit('messagesReadByUser', data);
    });

    // ⭐ NUEVO: Indicador de escritura (typing)
    this.connection.on('userTyping', (data) => {
      console.log('⌨️ User typing:', data);
      this.emit('userTyping', data);
    });

    // ⭐ NUEVO: Reacciones a mensajes
    this.connection.on('messageReactionAdded', (data) => {
      console.log('😀 Message reaction added:', data);
      this.emit('messageReactionAdded', data);
    });

    this.connection.on('messageReactionRemoved', (data) => {
      console.log('❌ Message reaction removed:', data);
      this.emit('messageReactionRemoved', data);
    });

    // ⭐ NUEVO: Escuchar cambios de estado online/offline
    this.connection.on('userStatusChanged', (data) => {
      console.log('👤 User status changed:', data);
      this.emit('userStatusChanged', data);
    });

    // ⭐ NUEVO: Lista de usuarios online
    this.connection.on('onlineUsersList', (userIds) => {
      console.log('📋 Online users:', userIds);
      this.emit('onlineUsersList', userIds);
    });

    // Errores del servidor
    this.connection.on('Error', (error) => {
      console.error('❌ SignalR Error:', JSON.stringify(error, null, 2));
      this.emit('error', error);
    });
  }

  // Usuario envía mensaje a Admin específico
  async sendMessageToAdmin(adminId, content) {
    if (!this.isConnected || !this.connection) {
      throw new Error('Not connected to SignalR');
    }

    try {
      await this.connection.invoke('SendMessageToAdmin', adminId, content);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Admin envía respuesta
  async sendAdminReply(conversationId, content) {
    if (!this.isConnected || !this.connection) {
      throw new Error('Not connected to SignalR');
    }

    try {
      await this.connection.invoke('SendAdminReply', conversationId, content);
    } catch (error) {
      console.error('Error sending admin reply:', error);
      throw error;
    }
  }

  async markAsRead(conversationId) {
    if (!this.isConnected || !this.connection) return;

    try {
      await this.connection.invoke('MarkAsRead', conversationId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  // ⭐ NUEVO: Solicitar lista de usuarios online
  async requestOnlineUsers() {
    if (!this.isConnected || !this.connection) {
      console.warn('⚠️ Cannot request online users: not connected');
      return;
    }

    try {
      await this.connection.invoke('GetOnlineUsers');
    } catch (error) {
      console.error('Error requesting online users:', error);
    }
  }

  // ⭐ NUEVO: Enviar indicador de escritura
  async sendTypingIndicator(conversationId) {
    if (!this.isConnected || !this.connection) return;
    try {
      await this.connection.invoke('SendTypingIndicator', conversationId);
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }

  // ⭐ NUEVO: Agregar reacción a mensaje
  async addMessageReaction(messageId, emoji) {
    if (!this.isConnected || !this.connection) return;
    try {
      await this.connection.invoke('AddMessageReaction', messageId, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }

  // ⭐ NUEVO: Remover reacción de mensaje
  async removeMessageReaction(messageId, emoji) {
    if (!this.isConnected || !this.connection) return;
    try {
      await this.connection.invoke('RemoveMessageReaction', messageId, emoji);
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  }

  // Sistema de eventos
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  off(eventName, callback) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName] = this.listeners[eventName].filter((cb) => cb !== callback);
  }

  emit(eventName, data) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName].forEach((callback) => callback(data));
  }

  playNotificationSound() {
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch((e) => console.log('Could not play sound:', e));
    } catch (error) {
      console.log('Notification sound error:', error);
    }
  }

  async stop() {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.error('Error stopping connection:', error);
      }
      this.connection = null;
      this.isConnected = false;
      this.isInitializing = false;
      this.listeners = {};
      console.log('SignalR disconnected');
    }
  }
}

// ⭐ SINGLETON - UNA SOLA INSTANCIA GLOBAL
const signalRService = new SignalRService();
export default signalRService;
