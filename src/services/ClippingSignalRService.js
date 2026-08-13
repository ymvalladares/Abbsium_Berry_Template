import * as signalR from '@microsoft/signalr';

class ClippingSignalRService {
  constructor() {
    this.connection = null;
    this.listeners = [];
    this.pingInterval = null;
    this.started = false;
  }

  async start() {
    if (this.started && this.connection && this.connection.state === signalR.HubConnectionState.Connected) return;

    if (this.connection) {
      try {
        await this.connection.stop();
      } catch {}
      this.connection = null;
    }

    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:44328';

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl.replace(/\/$/, '')}/hubs/clipping`, {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .withServerTimeout(120000)
      .withKeepAliveInterval(30000)
      .build();

    this.connection.on('ConnectionEstablished', (connectionId) => {
      this.listeners.forEach((fn) => fn('connected', { connectionId }));
    });

    this.connection.on('Pong', (timestamp) => {
      console.log('[ClippingSignalR] Pong received:', timestamp);
    });

    this.connection.on('ClipJobStatus', (jobId, status) => {
      this.listeners.forEach((fn) => fn('status', { jobId, status }));
    });

    this.connection.on('ClipJobProgress', (data) => {
      this.listeners.forEach((fn) => fn('progress', data));
    });

    this.connection.on('ClipJobCompleted', (jobId) => {
      this.listeners.forEach((fn) => fn('completed', { jobId }));
    });

    this.connection.on('ClipJobFailed', (jobId, error) => {
      this.listeners.forEach((fn) => fn('failed', { jobId, error }));
    });

    this.connection.onreconnecting((error) => {
      console.warn('[ClippingSignalR] Reconnecting...', error);
      this.listeners.forEach((fn) => fn('reconnecting', {}));
    });

    this.connection.onreconnected((connectionId) => {
      console.log('[ClippingSignalR] Reconnected:', connectionId);
      this.listeners.forEach((fn) => fn('reconnected', { connectionId }));
      this.startPing();
    });

    this.connection.onclose((error) => {
      console.warn('[ClippingSignalR] Connection closed:', error);
      this.stopPing();
      this.listeners.forEach((fn) => fn('disconnected', { error }));
    });

    try {
      await this.connection.start();
      this.started = true;
      console.log('[ClippingSignalR] Connected');
      this.startPing();
    } catch (err) {
      console.error('[ClippingSignalR] Connection error:', err);
      this.started = false;
    }
  }

  startPing() {
    this.stopPing();
    this.pingInterval = setInterval(async () => {
      if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
        try {
          await this.connection.invoke('Ping');
        } catch {}
      }
    }, 25000);
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  onStatusChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback);
    };
  }

  async stop() {
    this.stopPing();
    this.started = false;
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch {}
      this.connection = null;
    }
  }
}

export const clippingSignalR = new ClippingSignalRService();
