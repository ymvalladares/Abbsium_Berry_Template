import * as signalR from '@microsoft/signalr';

class PublishingSignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.listeners = {};
    this.isInitializing = false;
  }

  async start(token, baseURL = import.meta.env.VITE_API_URL) {
    if (this.isInitializing) {
      console.warn('Publishing SignalR is already initializing');
      return;
    }

    if (this.connection && this.isConnected) {
      console.log('Publishing SignalR already connected');
      return;
    }

    this.isInitializing = true;

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseURL}hubs/publishing`, {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets,
          timeout: 120000
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.elapsedMilliseconds < 60000) {
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
            }
            return null;
          }
        })
        .withServerTimeout(120000)
        .withKeepAliveInterval(30000)
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.connection.onreconnecting((error) => {
        console.log('Publishing SignalR reconnecting...', error);
        this.isConnected = false;
        this.emit('connectionChanged', false);
      });

      this.connection.onreconnected((connectionId) => {
        console.log('Publishing SignalR reconnected:', connectionId);
        this.isConnected = true;
        this.emit('connectionChanged', true);
      });

      this.connection.onclose((error) => {
        console.log('Publishing SignalR connection closed:', error);
        this.isConnected = false;
        this.isInitializing = false;
        this.emit('connectionChanged', false);
      });

      this.registerServerEvents();

      await this.connection.start();
      console.log('Connected to Publishing SignalR Hub');
      this.isConnected = true;
      this.isInitializing = false;
      this.emit('connectionChanged', true);
    } catch (error) {
      console.error('Publishing SignalR Connection Error:', error);
      this.isConnected = false;
      this.isInitializing = false;
      this.connection = null;
      throw error;
    }
  }

  registerServerEvents() {
    if (!this.connection) return;

    this.connection.on('publish_started', (data) => {
      console.log('Publish started:', data);
      this.emit('publish_started', data);
    });

    this.connection.on('network_status', (data) => {
      console.log('Network status update:', data);
      this.emit('network_status', data);
    });

    this.connection.on('publish_finished', (data) => {
      console.log('Publish finished:', data);
      this.emit('publish_finished', data);
    });

    this.connection.on('Error', (error) => {
      console.error('Publishing SignalR Error:', JSON.stringify(error, null, 2));
      this.emit('error', error);
    });
  }

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

  async stop() {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.error('Error stopping publishing connection:', error);
      }
      this.connection = null;
      this.isConnected = false;
      this.isInitializing = false;
      this.listeners = {};
      console.log('Publishing SignalR disconnected');
    }
  }
}

const publishingSignalRService = new PublishingSignalRService();
export default publishingSignalRService;
