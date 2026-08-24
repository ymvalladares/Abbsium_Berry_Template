import * as signalR from '@microsoft/signalr';

class ClippingSignalRService {
  constructor() {
    this.connection = null;
    this.listeners = [];
    this.pingInterval = null;
    this.started = false;
    this.reconnectAttempt = 0;
    this.maxReconnectAttempts = 10;
    this.currentJobId = null;
    this.pollingInterval = null;
    this.isPolling = false;
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
      this.reconnectAttempt = 0;
      this.stopPolling();
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
      this.currentJobId = null;
      this.stopPolling();
      this.listeners.forEach((fn) => fn('completed', { jobId }));
    });

    this.connection.on('ClipJobFailed', (jobId, error) => {
      this.currentJobId = null;
      this.stopPolling();
      this.listeners.forEach((fn) => fn('failed', { jobId, error }));
    });

    this.connection.onreconnecting((error) => {
      console.warn('[ClippingSignalR] Reconnecting...', error);
      this.reconnectAttempt++;
      this.listeners.forEach((fn) => fn('reconnecting', {}));
    });

    this.connection.onreconnected(async (connectionId) => {
      console.log('[ClippingSignalR] Reconnected:', connectionId);
      this.reconnectAttempt = 0;
      this.startPing();
      this.listeners.forEach((fn) => fn('reconnected', { connectionId }));
    });

    this.connection.onclose(async (error) => {
      console.warn('[ClippingSignalR] Connection closed:', error);
      this.stopPing();
      this.started = false;
      this.listeners.forEach((fn) => fn('disconnected', { error }));

      if (this.reconnectAttempt < this.maxReconnectAttempts) {
        console.log('[ClippingSignalR] Attempting auto-reconnect...');
        try {
          await this.start();
        } catch (err) {
          console.error('[ClippingSignalR] Auto-reconnect failed:', err);
          this.startPolling();
        }
      } else {
        console.warn('[ClippingSignalR] Max reconnect attempts reached, falling back to HTTP polling');
        this.startPolling();
      }
    });

    try {
      await this.connection.start();
      this.started = true;
      console.log('[ClippingSignalR] Connected');
      this.startPing();
    } catch (err) {
      console.error('[ClippingSignalR] Connection error, falling back to HTTP polling:', err);
      this.started = false;
      this.startPolling();
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

  startPolling() {
    if (this.isPolling) return;
    this.isPolling = true;
    console.log('[ClippingSignalR] Starting HTTP polling fallback');

    this.pollingInterval = setInterval(async () => {
      if (!this.currentJobId) return;

      try {
        const { clippingAPI } = await import('services/AxiosService');
        const res = await clippingAPI.getJob(this.currentJobId);
        const job = res.data;

        if (job.status === 'completed') {
          this.listeners.forEach((fn) => fn('completed', { jobId: this.currentJobId }));
          this.currentJobId = null;
          this.stopPolling();
        } else if (job.status === 'failed') {
          this.listeners.forEach((fn) => fn('failed', { jobId: this.currentJobId, error: job.errorMessage || 'Job failed' }));
          this.currentJobId = null;
          this.stopPolling();
        } else {
          const progress = job.progress || 0;
          this.listeners.forEach((fn) => fn('progress', {
            jobId: this.currentJobId,
            status: job.status,
            progress,
            message: ''
          }));
        }
      } catch (err) {
        console.error('[ClippingSignalR] Polling error:', err);
      }
    }, 3000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
  }

  trackJob(jobId) {
    this.currentJobId = jobId;
    if (this.isPolling && !this.connection) {
      console.log('[ClippingSignalR] Tracking job via polling:', jobId);
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
    this.stopPolling();
    this.started = false;
    this.reconnectAttempt = 0;
    this.currentJobId = null;
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch {}
      this.connection = null;
    }
  }
}

export const clippingSignalR = new ClippingSignalRService();
