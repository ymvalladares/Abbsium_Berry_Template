import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.listeners = {};
    this.isInitializing = false;
  }

  async start(token, baseURL = 'https://localhost:44328') {
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
        .withUrl(`${baseURL}/hubs/chat`, {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
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

    // Confirmación de mensaje enviado
    this.connection.on('messageSent', (message) => {
      console.log('📤 Message sent:', message);
      this.emit('messageSent', message);
    });

    // Nuevo mensaje de admin
    this.connection.on('newAdminMessage', (message) => {
      console.log('📨 New admin message:', message);
      this.emit('newAdminMessage', message);
      this.playNotificationSound();
    });

    // Nuevo mensaje de usuario (para admin)
    this.connection.on('newUserMessage', (message) => {
      console.log('📨 New user message:', message);
      this.emit('newUserMessage', message);
      this.playNotificationSound();
    });

    // Confirmación de respuesta de admin
    this.connection.on('adminReplySent', (message) => {
      console.log('📤 Admin reply sent:', message);
      this.emit('adminReplySent', message);
    });

    // Mensajes marcados como leídos
    this.connection.on('messagesMarkedAsRead', (conversationId) => {
      console.log('✅ Messages marked as read:', conversationId);
      this.emit('messagesMarkedAsRead', conversationId);
    });

    // Errores
    this.connection.on('Error', (error) => {
      console.error('❌ SignalR Error:', error);
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
